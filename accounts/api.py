from django.contrib.auth.models import User
from  django.core.exceptions import ObjectDoesNotExist

from rest_framework.response import Response
from rest_framework import permissions
from rest_framework.views import View
from rest_framework.generics import (
    ListCreateAPIView,
    GenericAPIView
)

from knox.models import AuthToken
from knox.views import LogoutView

from .serializers import (
    RegisterSerializer,
    LoginSer,
    ValidateUsernameEmailSer
)

class RegisterView(ListCreateAPIView):
    serializer_class = RegisterSerializer
    queryset = User.objects.all()

    def post(self , request):
        user_ser = self.get_serializer(data = request.data)
        user_ser.is_valid(raise_exception = True)
        user = user_ser.save()

        # make the user active
        user.profile.active = True
        user.profile.save()
        user_ser = self.get_serializer(user)

        return Response({
            "user" : user_ser.data,
            "token" : AuthToken.objects.create(user)[1]
        })

class LogInView(GenericAPIView):
    serializer_class = LoginSer
    queryset = User.objects.all()

    def post(self , request):
        user_ser = self.get_serializer(data = request.data)
        user_ser.is_valid(raise_exception = True)
        try :
            user = User.objects.get(username = request.data["username_or_email"]) 
        except ObjectDoesNotExist : 
            user = User.objects.get(email = request.data["username_or_email"]) 

        user.profile.active = True
        user.profile.save()
        user_ser = RegisterSerializer(user)

        return Response({
            "user" : user_ser.data,
            "token" : AuthToken.objects.create(user)[1]
        })

class GetUserInfoView(GenericAPIView):
    queryset = User.objects.all()
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def get(self , request):
        user = request.user  
        user_ser = RegisterSerializer(user)

        return Response(user_ser.data)

class Logout(GenericAPIView):
    queryset = User.objects.all()
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def post(self, request, *args, **kwargs):
        user = request.user 
        user.profile.active = False 
        user.profile.save()
        view = LogoutView.as_view()
        return view(request._request, *args, **kwargs)


class ValidateView(GenericAPIView):
    queryset = User.objects.all()
    serializer_class = ValidateUsernameEmailSer

    def post(self, request, *args, **kwargs):
        validate_ser = self.get_serializer(data = request.data)
        validate_ser.is_valid(raise_exception=True)
        
        # if there is no error return a response
        return Response({
            "response" : "there is no error"
        })