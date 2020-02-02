from django.db import models
from django.contrib.auth.models import User 
from django.utils import timezone
from django.db.models import Q
from django.core.exceptions import ObjectDoesNotExist

class Profile(models.Model):
    user = models.OneToOneField(User ,on_delete=models.CASCADE)
    icon = models.CharField(max_length=256)
    active = models.BooleanField(default=False)
    join_date = models.DateTimeField(default=timezone.now)
    born_date = models.DateTimeField(blank=True)

    #check if there is a friendship
    #between this profile and a target profile
    def get_friendship(self, target_id):
        try :
            friendship = FriendShip.objects.get(
                Q(inviter = self.id ,friend=target_id)
                | 
                Q(inviter = target_id ,friend=self.id)
            )
            print("freindship : ",self.user.username)
        except ObjectDoesNotExist:
            return False 
        return friendship

    def add_friend(self, friend):
        frirnd_ship = FriendShip(inviter=self, friend=friend)
        frirnd_ship.save()
        return frirnd_ship

    def __str__(self):
        return self.user.username


class FriendShip(models.Model):
    inviter = models.ForeignKey(Profile ,on_delete=models.CASCADE ,related_name="inviter") 
    friend = models.ForeignKey(Profile ,on_delete=models.CASCADE ,related_name="friend") 
    date = models.DateTimeField(default=timezone.now)
    # is this friendship accepted by the friend
    accepted = models.BooleanField(default=False)

    def __self__():
        return f"friendship between {self.inviter} || {self.friend}"