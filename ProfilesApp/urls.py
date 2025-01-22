from django.conf import settings
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path("",include("frontend.urls")),
    path("accounts/",include("accounts.urls")),
    path("main/",include("mainFrontend.urls")),
    path("message/",include("chat.urls")),
    path('api/auth/oauth/', include('rest_framework_social_oauth2.urls')),
    path('reset_password/', include('django_rest_passwordreset.urls', namespace='password_reset')),
]

# if settings.DEBUG:
#     import debug_toolbar
#     urlpatterns += [path('__debug__/', include(debug_toolbar.urls))]