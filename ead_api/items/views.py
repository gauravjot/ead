import pytz
import json
from datetime import datetime
# RestFramework
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
# Models & Serializers
from .models import Item, ItemType, Allocation
from .serializers import ItemTypeSerializer, ItemSerializer, AllocationSerializer
# Session
from admins.sessions import getAdminID
from admins.utils import errorResponse, successResponse


"""
--------------------------------------------
 ItemType methods
--------------------------------------------
"""

# Add new Item Type
# -----------------------------------------------
@api_view(['POST'])
def addItemType(request):
    adminID = getAdminID(request)
    if type(adminID) is Response:
        return adminID
    # create serializer 
    itemTypeSerializer = ItemTypeSerializer(data=dict(
        name = request.data['name'],
        description = request.data['description'],
        template = json.loads(request.data['template']),
        created_by = str(adminID.username),
        created_at = datetime.now(pytz.utc)
    ))
    # if valid then add 
    if itemTypeSerializer.is_valid():
        itemTypeSerializer.save()
        return Response(data=successResponse(itemTypeSerializer.data), status=status.HTTP_201_CREATED)
    else:
        return Response(data=errorResponse(itemTypeSerializer.errors), status=status.HTTP_400_BAD_REQUEST)


# Get all Item Type
# -----------------------------------------------
@api_view(['GET'])
def getAllItemTypes(request):
    # Get requesting admin ID
    admin = getAdminID(request)
    if type(admin) is Response:
        return admin
    return Response(data=successResponse(ItemTypeSerializer(ItemType.objects.all().order_by('name'), many=True).data), status=status.HTTP_200_OK)

