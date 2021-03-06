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
        except ObjectDoesNotExist:
            return False 
        return friendship

    def add_friend(self, friend):
        #check if there is already a friendship between this two users
        friendship = FriendShip.objects.filter(
            Q(inviter=self, friend=friend) | Q(
                inviter=friend, friend=self)
        )
        if not friendship.exists():
            friend_ship = FriendShip(inviter=self, friend=friend)
            friend_ship.save()
            # create a notification to this friend
            # so he can accept or reject this invite
            notification = Notification(
                profile=friend,
                type="request",
                friendship=friend_ship
            )
            notification.save()
            return friend_ship

    def __str__(self):
        return self.user.username


class FriendShip(models.Model):
    inviter = models.ForeignKey(Profile ,on_delete=models.CASCADE ,related_name="inviter") 
    friend = models.ForeignKey(Profile ,on_delete=models.CASCADE ,related_name="friend") 
    date = models.DateTimeField(default=timezone.now)
    # is this friendship accepted by the friend
    accepted = models.BooleanField(default=False)

    def __str__(self):
        return f"friendship between {self.inviter} || {self.friend}"

class Group(models.Model):
    creator = models.ForeignKey(User ,related_name="my_groups" ,on_delete=models.CASCADE)
    name = models.CharField(max_length=256)
    icon = models.CharField(max_length=256 ,null=True)
    members = models.ManyToManyField(User ,related_name="chat_groups")
    type = models.CharField(max_length=256)

    # define the state of a giver user inside this group
    # (member - sent request to join - admin - no relation)
    def user_state(self ,user):
        if user == self.creator:
            return "admin"
        # is this a member inside this group
        elif user in self.members.all():
            return "member"
        # if this user sent a request to join this group
        elif Notification.objects.filter(type="group request", group=self ,associated=user.profile) :
            return "sent"
        # not member and not the creator 
        else :
            return "stranger"

    def __str__(self):
        return str(self.name)
        
class Notification(models.Model):
    profile = models.ForeignKey(Profile ,on_delete=models.CASCADE ,related_name="notifications") 
    type = models.CharField(max_length=256)
    friendship = models.ForeignKey(FriendShip ,on_delete=models.CASCADE ,related_name="notifications",null=True)
    group = models.ForeignKey(Group ,on_delete=models.CASCADE ,related_name="notifications",null=True)
    associated = models.ForeignKey(Profile ,on_delete=models.CASCADE ,related_name="nots",null=True) 

    def __str__(self):
        return f"Notification to {self.profile.user.username}"
