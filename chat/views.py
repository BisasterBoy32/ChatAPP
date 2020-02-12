from django.contrib.auth.models import User
from .models import Message, ReadMessage
from accounts.models import Group
from django.utils import timezone
from .helpers import check_friendship

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
