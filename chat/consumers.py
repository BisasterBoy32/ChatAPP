from channels.consumer import AsyncConsumer 
from chat.models import Message 
from channels.db import database_sync_to_async

class ChatConsumer(AsyncConsumer):
    async def websocket_connect(self,event):
        print("Connecting" ,"\nself : ", self ,"\nevent : ",event)
        await self.send({
            "type": "websocket.accept",
            "text" :"hello world"
         })
    async def websocket_reveive(self,event):
        print(self ,event)
    async def websocket_disconnect(self,event):
        print("Disconecting" ,"\nself : ", self ,"\nevent : ",event)