from django.contrib.auth.models import User
from channels.generic.websocket import WebsocketConsumer
import json
from asgiref.sync import async_to_sync
from .models import Message
from accounts.models import Group
from .views import create_message ,create_message_for_group
from .helpers import create_group_name ,create_group_name_for_group
from .serializes import GroupMessagesSer

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



class ChatGroupConsumer(WebsocketConsumer):

    def connect(self):
        # accept connection
        # authenticate the logged in user
        user = self.scope['user']
        # get the group id to generate a unique group name
        group_id = self.scope['url_route']['kwargs']['group']
        self.group_id = group_id
        group = Group.objects.get(pk=group_id)
        group_name = create_group_name_for_group(group)
        self.group_name = group_name
        print(group_name)
        # add key-value (channel, group) to redis 
        # each time any user send message from any channel
        # the response will be sent to all the channels that has the
        # same 'group' in redis
        async_to_sync(self.channel_layer.group_add)(
            self.group_name,
            self.channel_name
        )
        self.accept()

    def receive(self, text_data):
        user = self.scope['user']
        # extract the message data
        data = json.loads(text_data)
        #  apply a task (create message ..etc)
        self.commands[data["command"]](self, data, user)

    def create_message(self ,data ,user):
        msg = create_message_for_group(user ,self.group_id,data)
        msg_ser = GroupMessagesSer(msg)
        data = json.dumps(msg_ser.data)
        async_to_sync(self.channel_layer.group_send)(
            self.group_name,
            {
                "type": "broadcast_message",
                "data": data
            }
        )

    def broadcast_message(self, event):
        self.send(text_data=event["data"])

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.group_name,
            self.channel_name
        )

    commands = {
        "close_socket" : disconnect,
        "create_message" : create_message
    }



