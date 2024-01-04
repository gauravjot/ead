from django.urls import path
from invoices.views.client import *

urlpatterns = [
    path('api/invoice/client/add/', addClient),
    path('api/invoice/client/info/<id>/', getClient),
    path('api/invoice/client/all/', getAllClient),
    path('api/invoice/client/search/', searchClient),
    path('api/invoice/client/update/', updateClient),
    path('api/invoice/client/delete/', deleteClient),
    path('api/invoice/client/note/post/', postNoteToClient),
    path('api/invoice/client/note/delete/', deleteNoteFromClient),
    path('api/invoice/client/note/update/', updateNoteFromClient),
]
