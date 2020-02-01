from .models import Message
from django.contrib.auth.models import User

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

def get_current_user(token):
    return User.objects.raw(f'SELECT user_id as id FROM knox_authtoken WHERE token_key = "{token}"')