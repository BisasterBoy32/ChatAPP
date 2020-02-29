from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.db.models import Q
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView, ListAPIView
from rest_framework import permissions, status ,pagination 
from .serializes import MessageSerializer, GroupMessagesSer
from .models import Message ,ReadMessage
from accounts.models import Group
from accounts.custom_permissions import IsMember
from .queries import get_messages

class MessageView(ListAPIView):
    serializer_class = MessageSerializer
    permission_classes =[
        permissions.IsAuthenticated
    ] 
    pagination_class = pagination.PageNumberPagination 

    def get_queryset(self):
        friend_id = self.request.query_params.get("r_id")
        friend = User.objects.get(id=friend_id)
        user = self.request.user
        # get all the messages sent or received by the current user 
        # to or from this user : "reciever_id"
        messages =  Message.objects.filter(
            Q(sender=friend,receiver=user)
            | 
            Q(sender=user ,receiver=friend)
        ).order_by('date').reverse()
        # make all the message received by this user
        # and sent by this frind as has been read 
        friend_messages = Message.objects.filter(
            sender=friend,
            receiver=user,
            hasBeenRead=False
        ).update(hasBeenRead=True)

        return messages

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

class GroupMessageView(ListAPIView):
    serializer_class = GroupMessagesSer
    pagination_class = pagination.PageNumberPagination 
    permission_classes =[
        permissions.IsAuthenticated,
        IsMember
    ] 
    
    def get_queryset(self):
        group_id = self.request.query_params.get("g_id")
        group = get_object_or_404(Group ,pk=group_id)
        user = self.request.user
        # check if this user is a member or not inside this group
        self.check_object_permissions(self.request , group)
        # get all the messages sent inside this group
        messages = group.messages.all().order_by('date').reverse()
        # turn all the unread messages to read
        # for this current user
        for message in messages:
            ReadMessage.objects.filter(
                message=message, user=user
            ).update(read=True)

        return messages
