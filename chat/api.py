from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework import permissions
from .serializes import MessageSerializer
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