from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.core.exceptions import ObjectDoesNotExist

from knox.models import AuthToken
from rest_framework import serializers
from .models import Profile ,Notification ,Group
from chat.models import Message ,ReadMessage

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile 
        fields = ("user","icon","born_date","join_date","active")
        read_only_fields = ["join_date","active","user"]

class UpdateProfileSer(serializers.ModelSerializer):
    class Meta:
        model = Profile 
        fields = ("icon",)

class RegisterSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()

    class Meta:
        model = User
        fields = ("username","password","email","first_name","profile")
        extra_kwargs = {'password': {'write_only': True}}

    def create(self , validated_data):
        prfile_data = validated_data.pop("profile")
        user = User.objects.create(**validated_data)
        user.set_password(validated_data["password"])
        user.save()
        
        Profile.objects.create(
            user = user,
            **prfile_data
            )
        
        return user

    def validate(self , data):
        user_email = data["email"]
        users = User.objects.all()
        if users.filter(email = user_email).exists():
            raise serializers.ValidationError("this email already exists")
        return data

class UpdateUserSer(serializers.ModelSerializer):
    profile = UpdateProfileSer()

    class Meta:
        model = User
        fields = ("username","email","first_name","profile")

    def update(self , instance , validated_data):
        prfile_data = validated_data.pop("profile")
        instance.username = validated_data.get("username" , instance.username)
        instance.email = validated_data.get("email" , instance.email)
        instance.first_name = validated_data.get("first_name" , instance.first_name)
        instance.save()
        
        profile = instance.profile
        profile.icon = prfile_data.get("icon" ,profile.icon)
        profile.save()
        
        return instance

    def validate(self , data):
        user_instance = self.context["request"].user
        user_email = data["email"]
        users = User.objects.all()
        if users.filter(email = user_email).exclude(id=user_instance.id).exists():
            raise serializers.ValidationError("this email has been token choose another one please")
        return data
    
class LoginSer(serializers.Serializer):
    username_or_email = serializers.CharField()
    password = serializers.CharField()

    def validate(self , data):

        user = authenticate(username=data["username_or_email"],password=data["password"])
        if not user :
            # see if there is a user with this email 
            user = User.objects.filter(email=data["username_or_email"])
            #if there is no user with this email
            if not user.exists() :
                raise serializers.ValidationError("Wrong Credentials")
            elif not user[0].check_password(data["password"]) :
                raise serializers.ValidationError("Wrong Credentials")
        
        return data

class ValidateUsernameEmailSer(serializers.Serializer):
    username = serializers.CharField(required=False ,allow_blank=True)
    email = serializers.CharField(required=False ,allow_blank=True)

    def validate(self , data):
        username = data["username"]
        email = data["email"]

        if username :
            if User.objects.filter(username=username).exists() :
                raise serializers.ValidationError("user with this username already exists")
            return data
        
        else :
            if User.objects.filter(email=email).exists() :
                raise serializers.ValidationError("user with this email already exists")
            return data

# to get the friends
class GetUsersSer(serializers.ModelSerializer):
    icon = serializers.SerializerMethodField()
    active = serializers.SerializerMethodField()
    friendship = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ("id" ,"username" ,"icon","active","friendship")

    def get_icon(self ,object):
        return object.profile.icon

    # check if this user is active
    def get_active(self ,object):
        try:
            token = AuthToken.objects.get(user_id=object.id)
            # if the user have a token and it's not 
            # expired than that user is active other ways he offline
            if token.expiry > timezone.now() :
                return True 
            else :
                return False
        except ObjectDoesNotExist:
            return False

    def get_friendship(self ,object):
        user = self.context["request"].user 
        friendship = object.profile.get_friendship(user.profile.id)
        if friendship and friendship.accepted:
            return 'true'
        elif friendship and friendship.inviter == user.profile:
            return 'holded'
        elif friendship :
            return 'sent'
        else :
            return 'false'

    def get_friendship_state(self ,object):
        return object.profile.active

# to get all the user
class GetFriendsSer(serializers.ModelSerializer):
    icon = serializers.SerializerMethodField()
    active = serializers.SerializerMethodField()
    unReadMessages = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ("id" ,"username" ,"icon","active","unReadMessages")

    def get_icon(self ,object):

        return object.profile.icon

    def get_active(self ,object):
        try:
            token = AuthToken.objects.get(user_id=object.id)
            # if the user have a token and it's not 
            # expired than that user is active other ways he offline
            if token.expiry > timezone.now():
                return True
            else:
                return False
        except ObjectDoesNotExist:
            return False

    def get_unReadMessages(self ,object):
        loged_in_user = self.context["request"].user 
        friend = object
        # get all the messages sent by this friend
        # to this logged in user 
        unread_messages = Message.objects.filter(
            sender=friend,
            receiver=loged_in_user,
            hasBeenRead = False
        )  
        return unread_messages.count()


class NotificationSer(serializers.ModelSerializer):
    # user that sent a request or accepted it
    user = serializers.SerializerMethodField()
    # username the of user that sent a request or accepted it
    username = serializers.SerializerMethodField()
    # icon of the user that sent a request or accepted it
    icon = serializers.SerializerMethodField()
    # the group associated to this notification if 
    # it's a group notication
    group_info = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = ("id" ,"type" ,"icon","username","user","group_info",'group')

    def create(self ,validated_data):
        user = self.context['request'].user 
        group = validated_data['group']
        if group.type == "private":
            raise serializers.ValidationError("you can't send a request to a private group")

        notification = Notification.objects.create(
            profile = group.creator.profile,
            type=validated_data['type'],
            group=group,
            associated=user.profile
        )
        notification.save()
        return notification        


    def get_user(self ,object):
        if object.type == "request":
            return object.friendship.inviter.user.id
        elif object.type == "accept" :
            return  object.friendship.friend.user.id
        # in case the type is rejected the friendship 
        # is gonna be deleted and in this case we
        # associate a profile to this notification that points
        # to whom rejected this request
        else :
            return object.associated.user.id

    def get_username(self ,object):
        if object.type == "request":
            return object.friendship.inviter.user.username
        elif object.type == "accept" :
            return  object.friendship.friend.user.username
        else :
            return object.associated.user.username

    def get_icon(self ,object):
        if object.type == "request":
            return object.friendship.inviter.icon
        elif object.type == "accept" :
            return  object.friendship.friend.icon 
        else :
            return object.associated.icon
    
    def get_group_info(self ,object):
        if object.group:
            return {
                'id' : object.group.id,
                'name' : object.group.name,
                "icon" : object.group.icon
            }

class GroupSer(serializers.ModelSerializer):
    creator_info = serializers.SerializerMethodField()
    membership = serializers.SerializerMethodField()
    unReadMessages = serializers.SerializerMethodField()

    class Meta:
        model = Group
        fields = ("id" ,"name" ,"creator_info" ,"type" ,"icon","members" ,"membership" ,"unReadMessages")
        read_only_fields = ("id" ,"creator")

    def create(self ,validated_data):
        user = self.context['request'].user
        group = Group.objects.create(
            creator = user,
            name = validated_data['name'],
            type = validated_data['type'],
            icon = validated_data['icon'],
        )
        group.save()
        for member in validated_data['members']:
            group.members.add(member)
        return group

    def get_creator_info(self ,object):
        return {
            "id" : object.creator.id,
            "icon" : object.creator.profile.icon,
            "username" : object.creator.username
        }

    # define the state of this user inside this group
    # (member - sent request to join - admin - stranger)
    def get_membership(self ,object):
        user = self.context["request"].user 
        return object.user_state(user)

    def get_unReadMessages(self, object):
        user = self.context["request"].user
        unread_msg = ReadMessage.objects.filter(
            group=object,
            user=user,
            read=False
        )
        return unread_msg.count()
