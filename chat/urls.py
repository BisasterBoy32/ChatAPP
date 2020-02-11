from django.urls import path
from .api import (
    GroupMessageView,
    MessageView, 
    SetMessageAsReadView
) 

urlpatterns = [
    path('', MessageView.as_view()),
    path('get_messages/', MessageView.as_view()),
    path('set_message/', SetMessageAsReadView.as_view()),
    path('group_messages/', GroupMessageView.as_view()),
]