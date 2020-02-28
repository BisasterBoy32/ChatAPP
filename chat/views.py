from django.contrib.auth.models import User
from .models import Message, ReadMessage
from accounts.models import Group, Notification ,FriendShip
from django.utils import timezone
from django.shortcuts import get_object_or_404

from .helpers import check_friendship ,get_friendship
from django.shortcuts import get_object_or_404

def create_message(data,sender):
    reciever = User.objects.get(id=int(data["receiver"]))
    # check the friendship between this two users
    if check_friendship(sender, reciever):
        msg = Message.objects.create(
            sender = sender,
            receiver=reciever,
            content = data["content"],
            date = data["date"]
        )
        msg.save()
        return msg
    else :
        return None


def create_message_for_group(sender, group, data):
    # check if this sender is a member inside this group
    group = Group.objects.get(id=group)
    if sender in group.members.all() or sender == group.creator:
        msg = Message.objects.create(
            sender=sender,
            group=group,
            content=data["content"],
            date=timezone.now()
        )
        msg.save()
        # tag this message as hasn't been read yet
        for member in group.members.all():
            if member != sender:
                read_msg = ReadMessage(
                    group=group,
                    user = member,
                    message=msg,
                )
                read_msg.save()
        if group.creator != sender:
            read_msg = ReadMessage(
                group=group,
                user=group.creator,
                message=msg,
            )
            read_msg.save()
        return msg
    else :
        return None

def delete_group_action(group_id, user):
    group = get_object_or_404(Group ,pk=group_id)
    if user == group.creator:
        group.delete()

    
# delete the friend ship between this two user
# if it exists
def delete_friend_action(user ,f_id):
    friend = User.objects.get(id=f_id)
    friendship = get_friendship(user ,friend)
    if friendship:
        friendship.delete()
