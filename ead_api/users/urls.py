from django.urls import path
from .views import *

urlpatterns = [
    path('api/user/add/', addUser),
    path('api/user/info/<id>/', getUser),
    path('api/user/all/', getAllUsers),
    path('api/user/search/', searchUser),
    path('api/user/update/', updateUser),
    path('api/user/delete/', deleteUser),
    path('api/user/note/post/', postNoteToUser),
    path('api/user/note/delete/', deleteNoteFromUser),
    path('api/user/note/update/', updateNoteFromUser),
]
