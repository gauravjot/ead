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
from admins.serializers import AdminSerializer
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
        name=request.data['name'],
        description=request.data['description'],
        template=None,
        created_by=str(adminID.username),
        created_at=datetime.now(pytz.utc),
        updated_at=datetime.now(pytz.utc),
        updated_by=str(adminID.username)
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


# Get Item Type
# -------------------------------
@api_view(['GET'])
def getItemType(request, id):
    # Get requesting admin ID
    admin = getAdminID(request)
    if type(admin) is Response:
        return admin
    # Get item type
    try:
        item_type = ItemType.objects.get(id=id)
        return Response(data=successResponse(ItemTypeSerializer(item_type).data), status=status.HTTP_200_OK)
    except ItemType.DoesNotExist:
        return Response(data=errorResponse("Item does not exist.", "I0001"), status=status.HTTP_404_NOT_FOUND)


# Add Item type field
# -------------------------------
@api_view(['POST'])
def addItemTypeField(request, id):
    # Get requesting admin ID
    admin = getAdminID(request)
    if type(admin) is Response:
        return admin
    # Get item type
    try:
        item_type = ItemType.objects.get(id=id)
        fields = json.loads(request.data['fields'])
        if item_type.template is None or len(item_type.template) < 1:
            item_type.template = []
        for field in fields:
            # check if field exists in item_type.fields array of key value pairs
            if field['n'] in [f['n'] for f in item_type.template]:
                return Response(data=errorResponse("Field already exists.", "I0003"), status=status.HTTP_400_BAD_REQUEST)
            else:
                item_type.template.append({"n": field["n"], "t": field["t"]})
        item_type.save()
        return Response(data=successResponse(ItemTypeSerializer(item_type).data), status=status.HTTP_200_OK)
    except ItemType.DoesNotExist:
        return Response(data=errorResponse("Item does not exist.", "I0002"), status=status.HTTP_404_NOT_FOUND)


# Delete Item type field
# -------------------------------
@api_view(['PUT'])
def deleteItemTypeField(request, id):
    # Get requesting admin ID
    admin = getAdminID(request)
    if type(admin) is Response:
        return admin
    # Get item type
    try:
        item_type = ItemType.objects.get(id=id)
        field = json.loads(request.data['fields'])
        if item_type.template is None or len(item_type.template) < 1:
            return Response(data=errorResponse("No field to delete.", "I011"), status=status.HTTP_400_BAD_REQUEST)
        # check if field exists in item_type.fields array of key value pairs
        if field['n'] not in [f['n'] for f in item_type.template]:
            return Response(data=errorResponse("Field does not exist.", "I0010"), status=status.HTTP_400_BAD_REQUEST)
        else:
            for f in item_type.template:
                if f['n'] == field['n']:
                    item_type.template.remove(f)
        item_type.save()
        return Response(data=successResponse(ItemTypeSerializer(item_type).data), status=status.HTTP_200_OK)

    except ItemType.DoesNotExist:
        return Response(data=errorResponse("Item does not exist.", "I0002"), status=status.HTTP_404_NOT_FOUND)


@api_view(['DELETE'])
def deleteItemType(request, id):
    adminID = getAdminID(request)
    if type(adminID) is Response:
        return adminID
    try:
        ItemType.objects.get(id=id).delete()
        return Response(data=successResponse(), status=status.HTTP_200_OK)
    except ItemType.DoesNotExist:
        return Response(data=errorResponse("ItemType does not exist.", "I0014"), status=status.HTTP_404_NOT_FOUND)


"""
--------------------------------------------
 Item methods
--------------------------------------------
"""


# Get all Items
# -----------------------------------------------
@api_view(['GET'])
def getAllItems(request, id):
    # Get requesting admin ID
    admin = getAdminID(request)
    if type(admin) is Response:
        return admin
    l = list()
    for item in Item.objects.filter(item_type=id).order_by('name'):
        admin_detail = dict(AdminSerializer(item.added_by).data)
        admin_detail = dict(
            full_name=admin_detail['full_name'],
            username=admin_detail['username']
        )
        l.append({
            'name': item.name,
            'description': item.description,
            'id': item.id,
            'added_at': item.added_at,
            'added_by': admin_detail,
            'updated_at': item.updated_at,
            'updated_by': admin_detail,
            **{i.get("n")+"_c": i.get("v") for i in item.value}
        })
    res = successResponse(l)
    return Response(data=res, status=status.HTTP_200_OK)


# Add new Item
# -----------------------------------------------
@api_view(['POST'])
def addItem(request):
    adminID = getAdminID(request)
    if type(adminID) is Response:
        return adminID
    # create serializer
    itemSerializer = ItemSerializer(data=dict(
        name=request.data['name'],
        description=request.data['description'],
        value=request.data['value'],
        item_type=request.data['item_type'],
        added_by=str(adminID.username),
        added_at=datetime.now(pytz.utc),
        updated_at=datetime.now(pytz.utc),
        updated_by=str(adminID.username)

    ))
    # if valid then add
    if itemSerializer.is_valid():
        itemSerializer.save()
        return Response(data=successResponse(itemSerializer.data), status=status.HTTP_201_CREATED)
    else:
        return Response(data=errorResponse(itemSerializer.errors), status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def getItem(request, id):
    adminID = getAdminID(request)
    if type(adminID) is Response:
        return adminID
    try:
        return Response(data=successResponse(ItemSerializer(Item.objects.get(id=id)).data), status=status.HTTP_200_OK)
    except Item.DoesNotExist:
        return Response(data=errorResponse("Item does not exist.", "I0404"), status=status.HTTP_404_NOT_FOUND)


@api_view(['DELETE'])
def deleteItem(request, id):
    adminID = getAdminID(request)
    if type(adminID) is Response:
        return adminID
    try:
        Item.objects.get(id=id).delete()
        return Response(data=successResponse(), status=status.HTTP_200_OK)
    except Item.DoesNotExist:
        return Response(data=errorResponse("Item does not exist.", "I0404"), status=status.HTTP_404_NOT_FOUND)
