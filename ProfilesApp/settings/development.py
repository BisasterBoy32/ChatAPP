from .base import *
import dj_database_url

DEBUG = True
ALLOWED_HOSTS = ['127.0.0.1', 'localhost',
                 '192.168.43.201', '192.168.8.102']

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.mysql',
#         'NAME': "chat",
#         'USER': "root",
#         'PASSWORD': "",
#         'HOST': "127.0.0.1",
#         'PORT': '3308'
#     }
# }

DATABASES = {}
print("DATABASE: "+os.getenv("DATABASE_URL", ""))
DATABASES["default"] = dj_database_url.config(
    env="DATABASE_URL", default=os.getenv("DATABASE_URL")
)

STRIPE_PUBLIC_KEY = ''
STRIPE_SECRET_KEY = ''
