from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import get_object_or_404
from django.db.models import Q

from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from rest_framework.views import View
from rest_framework.generics import (
    ListCreateAPIView,
    GenericAPIView
)

from knox.models import AuthToken
from knox.views import LogoutView

from .custom_permissions import IsTheSameUser
from .models import Notification, Group ,FriendShip
from .serializers import (
    RegisterSerializer,
    LoginSer,
    ValidateUsernameEmailSer,
    UpdateUserSer,
    GetUsersSer,
    GetFriendsSer,
    NotificationSer,
    GroupSer
)
from chat.queries import(
    get_friends, 
    search_friends, 
    get_related_groups,
    search_related_groups
) 

# ------------ USER VIEWS --------------------------
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

# ------------ FRIENDS AND ACCOUNTS VIEWS --------------------------
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

# get all the friends
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

# get one friend
class GetFriendView(GenericAPIView):
    queryset = User.objects.all()
    serializer_class = GetFriendsSer

    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def get(self, request ,*args ,**kwargs):
        user_profile_id = request.user.profile
        friend = get_object_or_404(User ,pk=kwargs.get("friend"))
        friend_profile = friend.profile
        friendship = FriendShip.objects.filter(
            Q(inviter=user_profile_id ,friend=friend_profile ,accepted=True)
            |
            Q(inviter=friend_profile ,friend=user_profile_id ,accepted=True)
        )
        if friendship.exists():
            users_ser = self.get_serializer(friend)
            return Response(users_ser.data)
        else :
            response = {'error : ' : "you can't get this user information you have to be friends"}
            return Response(status=status.HTTP_403_FORBIDDEN, data=response)

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
            accounts = User.objects.filter(
                username__icontains=word ,profile__isnull=False
                ).exclude(pk=user.id)
            accounts_ser = self.get_serializer(accounts ,many=True)

            return  Response(accounts_ser.data)

# ------------ NOTIFICATIONS VIEWS --------------------------
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
        response = request.data["response"]
        if response == "accept":
            notification = Notification.objects.get(pk = request.data["id"])
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
            notification = Notification.objects.get(pk = request.data["id"])
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

        elif response == "group":
            not_ser = self.get_serializer(data=request.data)
            not_ser.is_valid(raise_exception=True)
            not_ser.save()

            response = not_ser.data
            return Response(status=status.HTTP_200_OK,data=response) 

        elif response == "group accept":
            notification = Notification.objects.get(pk = request.data["id"])
            # add this user who sent the request to the group members
            group = notification.group
            # check if the current user is the creator of the group
            if request.user != group.creator:
                response = {"action forbidden" : "only the creator of the group can accept a member to join"}
                return Response(status=status.HTTP_403_FORBIDDEN, data=response)

            group.members.add(notification.associated.user)
            # create a notification to tell this user who sent
            # a request to join a group that his request has been accepted
            accepted_not = Notification(
                profile = notification.associated,
                type = "group accept",
                group = group,
                associated = notification.profile
            )
            accepted_not.save()
            not_ser = self.get_serializer(accepted_not)
            # delete the old notification 
            notification.delete()
            response = not_ser.data
            return Response(status=status.HTTP_200_OK,data=response) 

        elif response == "group reject":
            notification = Notification.objects.get(pk = request.data["id"])
            # create a notification to tell this user who sent
            # a request to join a group that his request has been accepted
            accepted_not = Notification(
                profile = notification.associated,
                type = "group reject",
                group = notification.group,
                associated = notification.profile
            )
            accepted_not.save()
            not_ser = self.get_serializer(accepted_not)
            # delete the old notification 
            notification.delete()
            response = not_ser.data
            return Response(status=status.HTTP_200_OK,data=response) 

        else :
            # in case of simple notification delete it
            # after the user click on it
            notification = Notification.objects.get(pk = request.data["id"])
            notification.delete()
      
        return Response({"success" : "success"})


# GroupNotificationsView
class GroupNotificationsView(GenericAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationSer
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def post(self ,request ,*args ,**kwargs):
        not_ser = self.get_serializer(data=request.data)
        not_ser.is_valid(raise_exception=True)
        not_ser.save()

        response = not_ser.data
        return Response(status=status.HTTP_200_OK,data=response) 


# ------------ GROUP VIEWS --------------------------
class GroupView(GenericAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSer
    permission_classes =[
        permissions.IsAuthenticated
    ] 

    def post(self ,request ,*args ,**kwargs):
        group_ser = self.get_serializer(data=request.data)
        group_ser.is_valid(raise_exception=True)
        group_ser.save()

        response = group_ser.data
        return Response(status=status.HTTP_200_OK,data=response)       

    def get(self ,request ,*args ,**kwargs):
        user = request.user 
        user_groups = user.chat_groups
        # get the related group :
        # user is a creator of this group
        # or the user is a member inside this group
        # with SQL QUERY
        user_groups = get_related_groups(user.id)
        user_groups_ser = self.get_serializer(user_groups ,many=True)
        public_groups = Group.objects.filter(type="public")
        public_groups_ser = self.get_serializer(public_groups ,many=True)

        response = {
            "public_groups" : public_groups_ser.data,
            "user_groups" : user_groups_ser.data,
        }
        return Response(status=status.HTTP_200_OK, data=response)


class GroupSearchView(GenericAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSer
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def post(self, request, *args, **kwargs):
        user = request.user
        search_field = request.data["word"]
        # get the related group :
        # user is a creator of this group
        # or the user is a member inside this group
        # with the name of this group unclude search_field
        # with SQL QUERY
        user_groups = search_related_groups(user.id ,search_field)
        user_groups_ser = self.get_serializer(user_groups, many=True)
        public_groups = Group.objects.filter(type="public", name__icontains=search_field)
        public_groups_ser = self.get_serializer(public_groups, many=True)

        response = {
            "public_groups": public_groups_ser.data,
            "user_groups": user_groups_ser.data,
        }
        return Response(status=status.HTTP_200_OK, data=response)


class UpdateDeleteGroupView(GenericAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSer
    permission_classes =[
        permissions.IsAuthenticated
    ] 

    def put(self ,request ,*args ,**kwargs):
        group_id = kwargs.get('id')
        group = get_object_or_404(Group ,pk=group_id)
        # check if this user is the creator of this group
        if group.creator == request.user:
            group_ser = self.get_serializer(group ,data=request.data)
            group_ser.is_valid(raise_exception=True)
            group_ser.save()

            response = group_ser.data
            return Response(status=status.HTTP_200_OK,data=response) 
        else :
            response = {
                "permission denied" : "only the creator of the group can edit it"
            }
            return Response(status=status.HTTP_403_FORBIDDEN,data=response) 
