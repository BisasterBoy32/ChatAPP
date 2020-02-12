from django.contrib.auth.models import User
from .models import Message, ReadMessage
from accounts.models import Group
from django.utils import timezone

def create_message(data,sender):
    msg = Message.objects.create(
        sender = sender,
        receiver = User.objects.get(id=int(data["receiver"])),
        content = data["content"],
        date = data["date"]
    )
    msg.save()
    return msg


def create_message_for_group(sender, group, data):
    group = Group.objects.get(id=group)
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
        if member != sender:
            read_msg = ReadMessage(
                group=group,
                user=group.creator,
                message=msg,
            )
            read_msg.save()
    return msg
