def create_group_name(sender_id ,receiver_id):
    if sender_id < receiver_id :
        return str(f'group_{sender_id}{receiver_id}')
    else :
        return str(f'group_{receiver_id}{sender_id}')