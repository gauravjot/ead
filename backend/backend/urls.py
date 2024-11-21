from django.contrib import admin
from django.urls import path, include
# from django.conf.urls.static import static
# from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/user/', include('django_axor_auth.users.urls')),
    path('', include('items.urls')),
]
