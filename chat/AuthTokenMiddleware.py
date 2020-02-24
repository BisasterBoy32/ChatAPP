from channels.auth import AuthMiddlewareStack
from knox.models import AuthToken
from django.contrib.auth.models import AnonymousUser
from django.db import close_old_connections
from channels.db import database_sync_to_async
import re


@database_sync_to_async
def get_user(token_key):
    try:
        return AuthToken.objects.get(token_key=token_key).user
    except :
        return AnonymousUser()


class TokenAuthMiddleware:
    """
    Token authorization middleware for Django Channels 2
    see:
    https://channels.readthedocs.io/en/latest/topics/authentication.html#custom-authentication
    """

    def __init__(self, inner):
        self.inner = inner

    def __call__(self, scope):
        return TokenAuthMiddlewareInstance(scope, self)


class TokenAuthMiddlewareInstance:
    """
    Token authorization middleware for Django Channels 2
    """

    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope):
        # try to get the token from the url path
        breakpoint()
        path = scope['path']
        math = re.findall("\/\w{8}\/",path)
        token_key = math[0][1:-1]
        scope['user'] = await get_user(token_key)
        close_old_connections()

        return await self.inner(scope)

TokenAuthMiddlewareStack = lambda inner: TokenAuthMiddleware(AuthMiddlewareStack(inner))