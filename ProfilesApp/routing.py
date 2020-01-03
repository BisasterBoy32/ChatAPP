from django.urls import path
from channels.routing import ProtocolTypeRouter ,URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator, OriginValidator

from chat.consumers import ChatConsumer

application = ProtocolTypeRouter({
    'websocket': AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter(
                [   
                    path("chat/",ChatConsumer)
                ]
            )
        )
    )
})