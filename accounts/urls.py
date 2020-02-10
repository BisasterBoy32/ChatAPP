from django.urls import path
from . import api
from .exchange_token import (exchange_token)

urlpatterns = [
    path("",api.RegisterView.as_view()),
    path("login/",api.LogInView.as_view()),
    path("get_user/",api.GetUserInfoView.as_view()),
    path("logout/",api.Logout.as_view()),
    path("validate/",api.ValidateView.as_view()),
    path("update/",api.UpdateUserView.as_view()),
    path("get_all/",api.GetUsersView.as_view()),
    path("send_invite/",api.InviteUserView.as_view()),
    path("get_friends/",api.GetFriendsView.as_view()),
    path("get_notifications/",api.GetNotifications.as_view()),
    path("search/",api.SearchView.as_view()),
    path('groups/', api.GroupView.as_view()),
    path('groups/<int:id>/', api.UpdateDeleteGroupView.as_view()),
    path('group_notifications/', api.GroupNotificationsView.as_view()),
    path('oauth/login/<str:backend>/', exchange_token),
]