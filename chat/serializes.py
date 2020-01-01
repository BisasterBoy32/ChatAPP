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