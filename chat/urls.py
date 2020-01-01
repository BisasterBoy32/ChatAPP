from django.urls import path
from .api import MessageView

urlpatterns = [
    path('', MessageView.as_view()),
]