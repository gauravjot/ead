from django.urls import path
from .views import addItemType, getAllItemTypes

urlpatterns = [
    path('api/item/type/add/', addItemType),
    path('api/item/type/all/', getAllItemTypes),
#    path('api/user/logout/', logout),
#    path('api/user/verifyemail/<emailtoken>/', verifyEmail),
]
