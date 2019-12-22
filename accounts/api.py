from django.contrib.auth.models import User

from rest_framework.response import Response
from rest_framework.generics import ListCreateAPIView

from .serializers import RegisterSerializer

class RegisterView(ListCreateAPIView):
    serializer_class = RegisterSerializer
    queryset = User.objects.all()

    def post(self , request):
        user_ser = self.get_serializer(data = request.data)
        user_ser.is_valid(raise_exception = True)
        user = user_ser.save()
        user_ser = self.get_serializer(user)

        return Response({
            "user" : user_ser.data,
        })