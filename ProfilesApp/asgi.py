import os
import django
from django.routing import get_default_application
from channels.layers import get_channel_layer

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ProfilesApp.settings')
django.setup()
application = get_default_application()
channel_layer = get_channel_layer()
