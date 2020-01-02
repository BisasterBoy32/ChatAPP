from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework import permissions
from .serializes import MessageSerializer ,GetMessagesSer
from .models import Message

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
        receiver_id = request.query_params.get("r_id")
        messages = Message.objects.raw(f'''
        SELECT chat_message.content, chat_message.id, chat_message.date ,chat_message.receiver_id
            from chat_message
                where ( chat_message.receiver_id = {request.user.id} OR chat_message.receiver_id = {receiver_id} )
                    AND ( chat_message.sender_id = {request.user.id} OR chat_message.sender_id = {receiver_id} )
        ''')
        message_ser = GetMessagesSer(messages ,many=True)
        return  Response(message_ser.data)