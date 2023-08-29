from django.urls import path
from .views import register, login, logout

urlpatterns = [
    path('api/admin/register/', register),
    path('api/admin/login/', login),
    path('api/admin/logout/', logout),
#    path('api/admin/update/', update),
#    path('api/admin/disable/', disable),
#    path('api/admin/changepassword/', changePassword),
]
