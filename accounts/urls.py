from django.urls import path
from . import api

urlpatterns = [
    path("",api.RegisterView.as_view()),
    path("login/",api.LogInView.as_view()),
    path("get_user/",api.GetUserInfoView.as_view()),
    path("logout/",api.Logout.as_view()),
    path("validate/",api.ValidateView.as_view()),
    path("update/",api.UpdateUserView.as_view()),
]
