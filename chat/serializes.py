from django.contrib.auth.models import User
from rest_framework import serializers
from django.db.models import Q
from django.contrib.auth.models import User

from .models import Message
from accounts.models import FriendShip

class MessageSerializer(serializers.ModelSerializer):

    class Meta:
        model = Message 
        fields = ("id" ,"sender","receiver","date","content")
        read_only_fields = ["sender","id"]

    def create(self ,validated_data):
        message = Message.objects.create(
            **validated_data,
            sender = self.context["request"].user
            )
        message.save()

        return message
    
    def validate(self ,data):
        user = self.context["request"].user
        receiver = data["receiver"]
        # check if there is afriendship between this two users
        # and allow sending the message only if there are friends
        friendship = FriendShip.objects.filter(
            Q(inviter=user.profile ,friend = receiver.profile)
            |
            Q(inviter=receiver.profile  ,friend =user.profile) 
        )
        if friendship.exists() and friendship[0].accepted :
            return data
        else :
            raise serializers.ValidationError("you can send a message only to your friends")

class GetMessagesSer(serializers.Serializer):
    id = serializers.IntegerField()
    date = serializers.DateTimeField()
    content = serializers.CharField()
    receiver_id = serializers.IntegerField()
