from django.db.models import Q
from accounts.models import FriendShip

def create_group_name(sender_id ,receiver_id):
    if sender_id < receiver_id :
        return str(f'group_{sender_id}{receiver_id}')
    else :
        return str(f'group_{receiver_id}{sender_id}')

def create_group_name_for_group(group):
    name = ""
    list_name = group.name.split(" ")
    name = name.join(list_name)
    return f"{name}__{group.id}"

# check if two users are friends
def check_friendship(user1, user2):
    friendship = FriendShip.objects.filter(
        Q(inviter=user1.profile, friend=user2.profile) | Q(
            inviter=user2.profile, friend=user1.profile) & Q(accepted=True)
    )

    return friendship.exists()
