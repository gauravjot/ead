from django.urls import path
from users.views import *

urlpatterns = [
    path('api/user/all/', getAllUsers),
    path('api/user/new/', addUser),
    path('api/user/search/', searchUser),
    path('api/user/<id>/', userOperations),
    path('api/user/<id>/note/all/', getUserNotes),
    path('api/user/<id>/note/new/', postNoteToUser),
    path('api/user/<id>/note/<noteid>/', noteOperations),
]
