from django.urls import path
from .views import register, login, logout, me, adminInfo, enable, disable, changeMyPassword, changePassword, getAllAdmins, initialSetup

urlpatterns = [
    path('api/admin/setup/', initialSetup),
    # self
    path('api/admin/login/', login),
    path('api/admin/logout/', logout),
    path('api/admin/me/', me),
    path('api/admin/changemypswd/', changeMyPassword),
    # moderate other admins
    path('api/admin/register/', register),
    path('api/admin/info/<username>/', adminInfo),
    path('api/admin/disable/', disable),
    path('api/admin/enable/', enable),
    path('api/admin/changepswd/', changePassword),
    path('api/admin/all/', getAllAdmins),
]
