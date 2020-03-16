from .base import *

DEBUG = True
ALLOWED_HOSTS = ['127.0.0.1', 'localhost',
                 '192.168.43.201', '192.168.8.102']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': "chat",
        'USER': "root",
        'PASSWORD': "",
        'HOST': "127.0.0.1",
        'PORT': '3308'
    }
}

STRIPE_PUBLIC_KEY = ''
STRIPE_SECRET_KEY = ''
