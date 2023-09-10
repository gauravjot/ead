from django.urls import path
from .views import addUser, getUser, getAllUsers, searchUser, updateUser, deleteUser

urlpatterns = [
    path('api/user/add/', addUser),
    path('api/user/info/<id>/', getUser),
    path('api/user/all/', getAllUsers),
    path('api/user/search/', searchUser),
    path('api/user/update/', updateUser),
    path('api/user/delete/', deleteUser),
]
