from django.contrib.auth.models import User
from .models import Message

def create_message(data,sender):
    msg = Message.objects.create(
        sender = sender,
        receiver = User.objects.get(id=int(data["receiver"])),
        content = data["content"],
        date = data["date"]
    )
    msg.save()
    return msg
