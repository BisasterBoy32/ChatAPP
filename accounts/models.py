from django.db import models
from django.contrib.auth.models import User 
from django.utils import timezone
from django.db.models import Q

class Profile(models.Model):
    user = models.OneToOneField(User ,on_delete=models.CASCADE)
    icon = models.CharField(max_length=256)
    active = models.BooleanField(default=False)
    join_date = models.DateTimeField(default=timezone.now)
    born_date = models.DateTimeField(blank=True)

    def get_friends(self):
        friendships = FriendShip.objects.filter(Q(inviter=self) | Q(friend=self)).all()
        friends = friendships.inviter
        # for friendship in friendships:
        #     if friendship.inviter == self :
        #         friend = friendship.friend
        #     else :
        #         friend = friendship.inviter
        #     print(friend)
        # return friends

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