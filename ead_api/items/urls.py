from django.urls import path
from .views import *

urlpatterns = [
    path('api/item/type/add/', addItemType),
    path('api/item/type/all/', getAllItemTypes),
    path('api/item/type/<id>/', getItemType),
    path('api/item/type/<id>/edit/', editItemType),
    path('api/item/type/<id>/delete/', deleteItemType),
    path('api/item/type/<id>/template_fields/add/', addItemTypeField),
    path('api/item/type/<id>/items/', getAllItems),
    path('api/item/add/', addItem),
    path('api/item/<id>/', getItem),
    path('api/item/<id>/delete/', deleteItem),
    path('api/item/type/<id>/template_fields/delete/', deleteItemTypeField),
    #    path('api/user/verifyemail/<emailtoken>/', verifyEmail),
]
