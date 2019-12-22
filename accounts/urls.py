from django.urls import path
from . import api

urlpatterns = [
    path("",api.RegisterView.as_view()),
]
