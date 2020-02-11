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