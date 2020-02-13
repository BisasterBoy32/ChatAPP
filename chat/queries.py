from .models import Message
from django.contrib.auth.models import User
from accounts.models import Group

def get_messages(user_id ,receiver_id):
    return Message.objects.raw(f'''
    SELECT * FROM (
        SELECT chat_message.content, chat_message.id, chat_message.date ,chat_message.receiver_id
            from chat_message
                where ( chat_message.receiver_id = {user_id} OR chat_message.receiver_id = {receiver_id} )
                    AND ( chat_message.sender_id = {user_id} OR chat_message.sender_id = {receiver_id} )
                        ORDER BY chat_message.date DESC LIMIT 20
    ) AS messages 
    ORDER BY messages.date ASC
    ''')

def get_friends(u_p_id):
    return User.objects.raw(
        f'''
        SELECT id FROM auth_user 
            WHERE id IN (
                SELECT user_id from accounts_profile 
                    WHERE id != {u_p_id} 
                    AND ( 
                        id IN ( 
                            SELECT inviter_id from accounts_friendship
                            WHERE accepted=true AND friend_id = {u_p_id} OR inviter_id = {u_p_id} 
                        ) OR id IN ( 
                                SELECT friend_id from accounts_friendship 
                                WHERE accepted=true AND friend_id = {u_p_id} OR inviter_id = {u_p_id}
                        )
                    )
            )
        '''
    )

def search_friends(u_p_id ,word):
    return User.objects.raw(
        '''
        SELECT id FROM auth_user 
            WHERE username LIKE "%%{}%%" AND id IN (
                SELECT user_id from accounts_profile 
                    WHERE id != {} 
                    AND ( 
                        id IN ( 
                            SELECT inviter_id from accounts_friendship
                            WHERE accepted=true AND friend_id = {} OR inviter_id = {} 
                        ) OR id IN ( 
                                SELECT friend_id from accounts_friendship 
                                WHERE accepted=true AND friend_id = {} OR inviter_id = {}
                        )
                    )
            )
        '''.format(word , u_p_id, u_p_id, u_p_id, u_p_id, u_p_id)
    )

def get_related_groups(user_id):
    return Group.objects.raw(f'''
        SELECT * FROM accounts_group 
            WHERE creator_id = {user_id}
            OR id IN (
                SELECT group_id FROM accounts_group_members
                WHERE user_id = {user_id}
            )
    ''')


def search_related_groups(user_id ,word):
    return Group.objects.raw(f'''
        SELECT * FROM accounts_group 
            WHERE creator_id = {user_id}
            OR id IN (
                SELECT group_id FROM accounts_group_members
                WHERE user_id = {user_id}
            )
            AND name LIKE "%%{word}%%"
    ''')
