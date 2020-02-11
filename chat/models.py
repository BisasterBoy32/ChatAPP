from django.db import models
from django.contrib.auth.models import User 
from django.utils import timezone
from accounts.models import Group

class  Message(models.Model):
    sender = models.ForeignKey(User ,on_delete=models.CASCADE ,related_name="messages_sent")
    receiver =  models.ForeignKey(User ,on_delete=models.CASCADE,related_name="messages_received",null = True)
    group = models.ForeignKey(Group ,on_delete=models.CASCADE ,related_name="messages" ,null = True)
    date = models.DateTimeField(timezone.now)
    content = models.TextField()
    hasBeenRead = models.BooleanField(default=False)

    def __str__(self):
        return str(f'from {self.sender} to {self.receiver} saying : {self.content}')
    
# in case of a message that is related to a group
# we can't determine the hasBeenRead attribure
# so for each message we create multipule ReadMessage
# table that is related to the message ,profile and the group
class ReadMessage(models.Model):
    user = models.ForeignKey(User ,on_delete=models.CASCADE ,related_name="group_read")
    group = models.ForeignKey(Group ,on_delete=models.CASCADE ,related_name="read_messages")
    message = models.ForeignKey(Message ,on_delete=models.CASCADE ,related_name="read_messages")
    read = models.BooleanField(default=False)