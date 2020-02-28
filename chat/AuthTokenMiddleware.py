from channels.auth import AuthMiddlewareStack
from knox.models import AuthToken
from django.contrib.auth.models import AnonymousUser
from django.db import close_old_connections
import re

class TokenAuthMiddleware:
    """
    Token authorization middleware for Django Channels 2
    """

    def __init__(self, inner):
        self.inner = inner

    def __call__(self, scope):
        # try to get the token from the url path
        try :
            path = scope['path']
            math = re.findall("\/\w{8}\/",path)
            token_key = math[0][1:-1]
            user = AuthToken.objects.get(token_key=token_key).user
            scope['user'] = user
            close_old_connections()

        except :
            scope['user'] = AnonymousUser()

        return self.inner(scope)

TokenAuthMiddlewareStack = lambda inner: TokenAuthMiddleware(AuthMiddlewareStack(inner))