from django.db import models
from django.contrib.auth.models import User 
from django.utils import timezone

class  Message(models.Model):
    sender = models.ForeignKey(User ,on_delete=models.CASCADE ,related_name="messages_sent")
    receiver =  models.ForeignKey(User ,on_delete=models.CASCADE,related_name="messages_received")
    date = models.DateTimeField(timezone.now)
    content = models.TextField()