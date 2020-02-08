from django.contrib.auth.models import User
from channels.generic.websocket import WebsocketConsumer
import json
from asgiref.sync import async_to_sync
from .models import Message
from .views import create_message
from .helpers import create_group_name

class ChatConsumer(WebsocketConsumer):

    def connect(self):
        # accept connection
        # authenticate the logged in user
        user = self.scope['user']
        # other user is the one who the user
        # want to chat with him
        other_user = self.scope['url_route']['kwargs']['receiver']
        group_name = create_group_name(user.id ,other_user)
        self.group_name = group_name
        # add key-value (channel, group) to redis 
        # each time any user send message from any channel
        # the response will be sent to all the channels that has the
        # same 'group' in redis
        async_to_sync(self.channel_layer.group_add)(
            self.group_name,
            self.channel_name
        )
        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.group_name,
            self.channel_name
        )

    def receive(self, text_data):
        user = self.scope['user']
        # extract the message data
        data = json.loads(text_data)
        #  apply a task (create message ..etc)
        self.commands[data["command"]](self, data ,user) 

    def new_message(self ,data ,sender):
        msg = create_message(data ,sender)
        msg = self.serializer_message(msg)
        # strigngify message
        data = json.dumps(msg)
        async_to_sync(self.channel_layer.group_send)(
            self.group_name,
            {
                "type" : "broadcast_message",
                "data" : data 
            }
        )

    def broadcast_message(self ,event):
        print("channel : " ,self.channel_name)
        self.send(text_data=event["data"])

    # form the message to send it
    def serializer_message(self ,message):
        data = {
            'id' : message.id,
            'date' : message.date,
            'content' : message.content,
            'receiver_id' : message.receiver.id,
            'sender_id' : message.sender.id,
            'command' : 'new_message'
        }
        return data
       
    commands = {
        "create_message" : new_message
    }
