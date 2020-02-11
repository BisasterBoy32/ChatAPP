from django.contrib.auth.models import User
from .models import Message
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
    msg = Message.objects.create(
        sender=sender,
        group=Group.objects.get(id=group),
        content=data["content"],
        date=timezone.now()
    )
    msg.save()
    return msg
