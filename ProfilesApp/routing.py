from django.urls import path
from channels.routing import ProtocolTypeRouter ,URLRouter
from chat.AuthTokenMiddleware import TokenAuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator, OriginValidator

from chat.consumers import ChatConsumer, ChatGroupConsumer

application = ProtocolTypeRouter({
    'websocket': AllowedHostsOriginValidator(
        TokenAuthMiddlewareStack(
            URLRouter(
                [   
                    path("chat/<str:token>/<int:receiver>/",ChatConsumer),
                    path("group_chat/<str:token>/<int:group>/",ChatGroupConsumer)
                ]
            )
        )
    )
})