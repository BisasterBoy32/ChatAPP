from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Message

class MessageSerializer(serializers.ModelSerializer):

    class Meta:
        model = Message 
        fields = ("id" ,"sender","receiver","date","content")
        read_only_fields = ["sender"]

    def create(self ,validated_data):
        message = Message.objects.create(
            **validated_data,
            sender = self.context["request"].user
            )
        message.save()

        return message

class GetMessagesSer(serializers.Serializer):
    id = serializers.IntegerField()
    date = serializers.DateTimeField()
    content = serializers.CharField()
    receiver_id = serializers.IntegerField()
