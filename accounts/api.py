from django.contrib.auth.models import User
from  django.core.exceptions import ObjectDoesNotExist
from .custom_permissions import IsTheSameUser

from rest_framework.response import Response
from rest_framework import permissions
from rest_framework.views import View
from rest_framework.generics import (
    ListCreateAPIView,
    GenericAPIView
)

from knox.models import AuthToken
from knox.views import LogoutView

from .models import Notification
from .serializers import (
    RegisterSerializer,
    LoginSer,
    ValidateUsernameEmailSer,
    UpdateUserSer,
    GetUsersSer,
    GetFriendsSer,
    NotificationSer
)
from chat.queries import get_friends, search_friends

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

class UpdateUserView(GenericAPIView):
    serializer_class = UpdateUserSer
    queryset = User.objects.all()
    permission_classes = [
        permissions.IsAuthenticated,
        IsTheSameUser
    ]

    def post(self , request):
        user_instance = User.objects.get(id = request.data["profile"]["user"])
        self.check_object_permissions(request , user_instance)
        user_ser = self.get_serializer(user_instance ,data = request.data)
        user_ser.is_valid(raise_exception = True)
        user = user_ser.save()

        return Response(self.get_serializer(user).data)

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

class GetUsersView(GenericAPIView):
    queryset = User.objects.all()
    serializer_class = GetUsersSer
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def get(self, request):
        # users = User.objects.filter(profile__isnull=False)
        # using MYSQL Syntax
        users = User.objects.raw(f'''
        SELECT DISTINCT * FROM auth_user
            WHERE auth_user.id IN ( SELECT user_id FROM accounts_profile ) 
                AND auth_user.id != {request.user.id}
        ''')
        users_ser = self.get_serializer(users ,many=True)
        
        return Response(users_ser.data)

# friend Invitation
class InviteUserView(GenericAPIView):
    queryset = User.objects.all()
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def post(self, request):
        user = request.user
        friend_id = request.data["friend"]
        friend = User.objects.get(pk=friend_id)
        user.profile.add_friend(friend.profile)

        return Response({"success" : "success"})

# friend Invitation
class GetFriendsView(GenericAPIView):
    queryset = User.objects.all()
    serializer_class = GetFriendsSer
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def get(self, request):
        user_profile_id = request.user.profile.id   
        friends = get_friends(user_profile_id)
        users_ser = self.get_serializer(friends ,many=True)

        return Response(users_ser.data)

# get all the notification of this user

class GetNotifications(GenericAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationSer
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def get(self, request):
        user = request.user
        notifications = user.profile.notifications.all()
        notifications_ser = self.get_serializer(notifications ,many=True)

        return Response(notifications_ser.data)

    def post(self, request):
        notification = Notification.objects.get(pk = request.data["id"])
        response = request.data["response"]
        if response == "accept":
            # apdate the friendship to accepted 
            # between current user and the user
            # who sent the friendship request 
            friendship = notification.friendship
            friendship.accepted = True
            friendship.save()
            notification.delete() 
            # create a notification to notify this 
            # user that his request has been accepted
            inviter = friendship.inviter
            notification = Notification(
                profile = inviter,
                type = "accept",
                friendship = friendship
            )
            notification.save()
        elif response == "reject":
            friendship = notification.friendship
            # notify this inviter that his request
            # has been rejected
            notification = Notification(
                profile = friendship.inviter,
                type = "reject",
                associated = friendship.friend,
            )
            notification.save()
            # delete the friendship between this two users
            friendship.delete()
        else :
            # in case of simple notification delete it
            # after the user click on it
            notification.delete()
      
        return Response({"success" : "success"})

class SearchView(GenericAPIView):
    queryset = User.objects.all()
    permission_classes =[
        permissions.IsAuthenticated
    ] 

    def get_serializer_class(self):
        s_type = self.request.data["s_type"]
        if s_type == "friends" :
            return GetFriendsSer

        elif s_type == "accounts" :
            return GetUsersSer

    def post(self ,request):
        s_type = request.data["s_type"]
        word = request.data["word"]
        user = request.user
        if s_type == "friends" :
            friends = search_friends(user.profile.id ,word)
            friends_ser = self.get_serializer(friends ,many=True)

            return Response(friends_ser.data)

        elif s_type == "accounts" :
            accounts = User.objects.filter(username__icontains=word ,profile__isnull=False)
            accounts_ser = self.get_serializer(accounts ,many=True)

            return  Response(accounts_ser.data)
