from django.urls import path
from .views import register, login, logout, me, update, disable, changePassword, getAllAdmins

urlpatterns = [
    # self
    path('api/admin/register/', register),
    path('api/admin/login/', login),
    path('api/admin/logout/', logout),
    path('api/admin/me/', me),
    path('api/admin/update/', update),
    path('api/admin/changepassword/', changePassword),
    # moderate other admins
    path('api/admin/disable/', disable),
    path('api/admin/all/', getAllAdmins),
]
