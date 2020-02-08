from django.db import models
from django.contrib.auth.models import User 
from django.utils import timezone
from accounts.models import Group

class  Message(models.Model):
    sender = models.ForeignKey(User ,on_delete=models.CASCADE ,related_name="messages_sent")
    receiver =  models.ForeignKey(User ,on_delete=models.CASCADE,related_name="messages_received")
    group = models.ForeignKey(Group ,on_delete=models.CASCADE ,related_name="messages" ,null = True)
    date = models.DateTimeField(timezone.now)
    content = models.TextField()
    hasBeenRead = models.BooleanField(default=False)

    def __str__(self):
        return str(f'from {self.sender} to {self.receiver} saying : {self.content}')
    
