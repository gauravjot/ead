import pytz
import json
from datetime import datetime
# RestFramework
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django_axor_auth.users.permissions import IsAuthenticated
from django_axor_auth.users.api import get_request_user
# Models & Serializers
from utils.response import successResponse, errorResponse
from .models import Item, ItemType
from .serializers import ItemTypeSerializer, ItemSerializer


"""
--------------------------------------------
 ItemType methods
--------------------------------------------
"""


# Add new Item Type
# -----------------------------------------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addItemType(request):
    user = get_request_user(request)
    # create serializer
    itemTypeSerializer = ItemTypeSerializer(data=dict(
        name=request.data['name'],
        description=request.data['description'],
        template=None,
        created_by=user.id,
        created_at=datetime.now(pytz.utc),
        updated_at=datetime.now(pytz.utc),
        updated_by=user.id
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
@permission_classes([IsAuthenticated])
def getAllItemTypes(request):
    return Response(data=successResponse(ItemTypeSerializer(ItemType.objects.all().order_by('name'), many=True).data), status=status.HTTP_200_OK)


# Get Item Type
# -------------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getItemType(request, id):
    try:
        item_type = ItemType.objects.get(id=id)
        return Response(data=successResponse(ItemTypeSerializer(item_type).data), status=status.HTTP_200_OK)
    except ItemType.DoesNotExist:
        return Response(data=errorResponse("Item does not exist.", "I0001"), status=status.HTTP_404_NOT_FOUND)


# Edit Item Type
# -------------------------------
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def editItemType(request, id):
    try:
        item_type = ItemType.objects.get(id=id)
        item_type.name = str(request.data['name'])
        item_type.description = str(request.data['description'])
        item_type.save()

        return Response(data=successResponse(ItemTypeSerializer(item_type).data), status=status.HTTP_200_OK)
    except ItemType.DoesNotExist:
        return Response(data=errorResponse("Item does not exist.", "I0004"), status=status.HTTP_404_NOT_FOUND)


# Add Item type field
# -------------------------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addItemTypeField(request, id):
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
                if "dV" in field:
                    item_type.template.append(
                        {"n": field["n"], "t": field["t"], "dV": field["dV"]})
                else:
                    item_type.template.append(
                        {"n": field["n"], "t": field["t"]})
        item_type.save()
        return Response(data=successResponse(ItemTypeSerializer(item_type).data), status=status.HTTP_200_OK)
    except ItemType.DoesNotExist:
        return Response(data=errorResponse("Item does not exist.", "I0002"), status=status.HTTP_404_NOT_FOUND)


# Delete Item type field
# -------------------------------
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def deleteItemTypeField(request, id):
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
@permission_classes([IsAuthenticated])
def deleteItemType(request, id):
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
@permission_classes([IsAuthenticated])
def getAllItems(request, id):
    l = list()
    for item in Item.objects.select_related("added_by", "updated_by").filter(item_type=id).order_by('name'):
        l.append({
            'name': item.name,
            'id': item.id,
            'added_at': item.added_at,
            'added_by': item.added_by.id,
            'updated_at': item.updated_at,
            'updated_by': item.updated_by.id,
            **{i.get("n")+"_c": i.get("v") for i in item.value}
        })
    res = successResponse(l)
    return Response(data=res, status=status.HTTP_200_OK)


# Add new Item
# -----------------------------------------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addItem(request):
    user = get_request_user(request)
    # create serializer
    itemSerializer = ItemSerializer(data=dict(
        name=request.data['name'],
        value=request.data['value'],
        item_type=request.data['item_type'],
        added_by=user.id,
        added_at=datetime.now(pytz.utc),
        updated_at=datetime.now(pytz.utc),
        updated_by=user.id

    ))
    # if valid then add
    if itemSerializer.is_valid():
        itemSerializer.save()
        return Response(data=successResponse(itemSerializer.data), status=status.HTTP_201_CREATED)
    else:
        return Response(data=errorResponse(itemSerializer.errors), status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getItem(request, id):
    try:
        return Response(data=successResponse(ItemSerializer(Item.objects.get(id=id)).data), status=status.HTTP_200_OK)
    except Item.DoesNotExist:
        return Response(data=errorResponse("Item does not exist.", "I0404"), status=status.HTTP_404_NOT_FOUND)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteItem(request, id):
    try:
        Item.objects.get(id=id).delete()
        return Response(data=successResponse(), status=status.HTTP_200_OK)
    except Item.DoesNotExist:
        return Response(data=errorResponse("Item does not exist.", "I0404"), status=status.HTTP_404_NOT_FOUND)
