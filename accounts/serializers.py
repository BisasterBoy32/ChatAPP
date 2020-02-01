from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework import serializers
from .models import Profile 
from chat.models import Message

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
            user = User.objects.get(email=data["username_or_email"])
            if not user.check_password(data["password"]) :
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

# to get all the user
class GetUsersSer(serializers.ModelSerializer):
    icon = serializers.SerializerMethodField()
    active = serializers.SerializerMethodField()
    unReadMessages = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ("id" ,"username" ,"icon","active","unReadMessages")

    def get_icon(self ,object):
        return object.profile.icon

    def get_active(self ,object):
        return object.profile.active

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

      
