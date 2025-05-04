from django.urls import path
from .views import *

urlpatterns = [
    path('api/item/type/add/', addItemType),
    path('api/item/type/all/', get_all_item_types),
    path('api/item/type/<id>/', getItemType),
    path('api/item/type/<id>/edit/', editItemType),
    path('api/item/type/<id>/delete/', deleteItemType),
    path('api/item/type/<id>/template_fields/add/', add_item_type_field),
    path('api/item/type/<item_type_id>/items/', get_all_items),
    path('api/item/add/', add_item),
    path('api/item/<id>/', get_item),
    path('api/item/<id>/delete/', delete_item),
    path('api/item/type/<id>/template_fields/delete/', delete_item_type_field),
    #    path('api/user/verifyemail/<emailtoken>/', verifyEmail),
]
