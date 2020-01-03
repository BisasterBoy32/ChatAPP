import os
import django
from django.routing import get_default_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ProfilesApp.settings')
django.setup()
application = get_default_application()
