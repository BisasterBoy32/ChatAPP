from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework import permissions
from .serializes import MessageSerializer ,GetMessagesSer
from .models import Message
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
        message_ser = GetMessagesSer(messages ,many=True)
        return  Response(message_ser.data)

class SetMessageAsReadView(GenericAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes =[
        permissions.IsAuthenticated
    ] 

    def post(self ,request):
        print("**************************")
        message = Message.objects.get(pk=request.data["message_id"])
        print(message.content)
        message.hasBeenRead = True 
        message.save()
        
        return Response({"success":True})