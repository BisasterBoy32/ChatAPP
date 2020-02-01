from django.urls import path
from .api import MessageView, SetMessageAsReadView


urlpatterns = [
    path('', MessageView.as_view()),
    path('get_messages/', MessageView.as_view()),
    path('set_message/', SetMessageAsReadView.as_view()),
]