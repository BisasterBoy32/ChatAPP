from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework import permissions, status
from .serializes import MessageSerializer, GroupMessagesSer
from .models import Message ,ReadMessage
from accounts.models import Group
from .queries import get_messages

class MessageView(GenericAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes =[
        permissions.IsAuthenticated
    ] 
 
    def post(self ,request):
        message_ser = self.get_serializer(data=request.data)
        message_ser.is_valid(raise_exception=True)
        message_ser.save()

        return Response(message_ser.data)
    
    def get(self, request):
        friend_id = request.query_params.get("r_id")
        # get all the messages sent or received by the current user 
        # to or from this user : "reciever_id"
        messages = get_messages(request.user.id ,friend_id)
        # make all the message received by this user
        # and sent by this frind as has been read 
        friend = User.objects.get(id=friend_id)
        friend_messages = Message.objects.filter(
            sender=friend,
            receiver=request.user,
            hasBeenRead=False
        )
        for message in friend_messages:
            message.hasBeenRead = True
            message.save()
        
        # serialize the data
        message_ser = self.get_serializer(messages ,many=True)
        return  Response(message_ser.data)

class SetMessageAsReadView(GenericAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes =[
        permissions.IsAuthenticated
    ] 

    def post(self ,request):
        # the message could come from a group or a normale chat
        # between two friends
        if request.data["type"] == "friend":
            message = Message.objects.get(pk=request.data["message_id"])
            message.hasBeenRead = True 
            message.save()

        elif request.data["type"] == "group":
            user = request.user
            message = Message.objects.get(pk=request.data["message_id"])
            ReadMessage.objects.filter(
                message=message, user=user
            ).update(read=True)

        return Response({"success":True})

class GroupMessageView(GenericAPIView):
    queryset = Message.objects.all()
    serializer_class = GroupMessagesSer
    permission_classes =[
        permissions.IsAuthenticated
    ] 
    
    def get(self, request):
        user = request.user
        group_id = request.query_params.get("g_id")
        group = get_object_or_404(Group ,pk=group_id)
        # check if this user is a member or not inside this group
        if user in group.members.all() or group.creator == user :
            # get all the messages sent inside this group
            messages = group.messages.all()
            # turn all the unread messages to read
            # for this current user
            for message in messages:
                ReadMessage.objects.filter(
                    message=message, user=user
                ).update(read=True)
                
            # serialize the data
            message_ser = self.get_serializer(messages ,many=True)
            return  Response(message_ser.data)
        else :
            response = "you are not a member you can see the messages for this group"
            return Response(status=status.HTTP_403_FORBIDDEN , data=response)
