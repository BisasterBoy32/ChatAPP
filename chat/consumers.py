from django.contrib.auth.models import User
from channels.generic.websocket import WebsocketConsumer
import json
from asgiref.sync import async_to_sync
from .models import Message
from accounts.models import Group
from .views import create_message ,create_message_for_group
from .helpers import create_group_name ,create_group_name_for_group ,check_friendship
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
        # check if this user is friend with the current user
        # and open a channel between them only if they are friends
        friend = User.objects.get(pk=other_user)
        self.friend = friend
        # if there arn't a friend there close the channel
        if not check_friendship(user, friend):
            self.disconnect(self, None)
        # otherways open a channel between them
        data = {"command": "connecting", "user": user.id}
        data = json.dumps(data)
        async_to_sync(self.channel_layer.group_send)(
            self.group_name,
            {
                "type": "broadcast_message",
                "data": data
            }
        )
        self.accept()

    def disconnect(self, close_code):
        # send a message for the friend that this user
        # has disconnectd
        data = {"command" : "disconnecting", "user" : self.scope['user'].id}
        data = json.dumps(data)
        async_to_sync(self.channel_layer.group_send)(
            self.group_name,
            {
                "type": "broadcast_message",
                "data": data
            }
        )
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

    def friend_typing(self, data ,user):
        text_data = {
            "friend" : user.id,
            "typing" : data['typing'],
            "command": "friend_typing"
        }
        # strigngify data
        data = json.dumps(text_data)
        async_to_sync(self.channel_layer.group_send)(
            self.group_name,
            {
                "type": "broadcast_message",
                "data": data
            }
        )

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
            'receiver' : message.receiver.id,
            'sender' : message.sender.id,
            'command' : 'new_message'
        }
        return data
       
    commands = {
        "create_message" : new_message,
        "friend_typing": friend_typing
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
        # check if this user is member inside this group 
        # if true open a channel otherways close the channel
        if user in group.members.all() or user == group.creator:
            self.accept()
        else :
            self.disconnect(self ,None)

    def receive(self, text_data):
        user = self.scope['user']
        # extract the message data
        data = json.loads(text_data)
        #  apply a task (create message ..etc)
        self.commands[data["command"]](self, data, user)

    def create_message(self ,data ,user):
        msg = create_message_for_group(user ,self.group_id,data)
        msg_ser = GroupMessagesSer(msg)
        data = {
            "command" : "new_message",
            "msg": msg_ser.data
        }
        data = json.dumps(data)
        async_to_sync(self.channel_layer.group_send)(
            self.group_name,
            {
                "type": "broadcast_message",
                "data": data
            }
        )

    def member_typing(self ,data ,user):
        text_data = {
            "command": "member_typing",
            "typing": data['typing'],
            "typer": user.username,
            "group" : self.group_id
        }
        text_data = json.dumps(text_data)
        async_to_sync(self.channel_layer.group_send)(
            self.group_name,
            {
                "type": "broadcast_message",
                "data": text_data
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
        "create_message" : create_message,
        "member_typing": member_typing
    }



