from django.db import models
from django.contrib.auth.models import User 
from django.utils import timezone

class Profile(models.Model):
    user = models.OneToOneField(User ,on_delete=models.CASCADE)
    icon = models.CharField(max_length=256)
    active = models.BooleanField(default=False)
    join_date = models.DateTimeField(default=timezone.now)
    born_date = models.DateTimeField(blank=True)

    def __str__(self):
        return self.user.username
