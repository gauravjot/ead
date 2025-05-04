import uuid

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
from .objs.item import ItemValue
from .objs.item_template import ItemTemplate, deserialize_item_template
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
        templates=None,
        created_by=user.id,
        created_at=datetime.now(pytz.utc),
        updated_by=None,
        updated_at=None
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
def get_all_item_types(request):
    user = get_request_user(request)
    # Get all items types made by the user
    item_types = ItemType.objects.filter(created_by=user).order_by('name')
    return Response(data=successResponse(ItemTypeSerializer(item_types, many=True).data), status=status.HTTP_200_OK)


# Get Item Type
# -------------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getItemType(request, id):
    user = get_request_user(request)
    try:
        item_type = ItemType.objects.get(id=id, created_by=user)
        return Response(data=successResponse(ItemTypeSerializer(item_type).data), status=status.HTTP_200_OK)
    except ItemType.DoesNotExist:
        return Response(data=errorResponse("Item does not exist.", "I0001"), status=status.HTTP_404_NOT_FOUND)


# Edit Item Type
# -------------------------------
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def editItemType(request, id):
    user = get_request_user(request)
    try:
        item_type = ItemType.objects.get(id=id, created_by=user)
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
def add_item_type_field(request, id):
    user = get_request_user(request)
    try:
        item_type = ItemType.objects.get(id=id, created_by=user)
        fields = request.data['fields']
        if item_type.templates is None or len(item_type.templates) < 1:
            item_type.templates = []
        for field in fields:
            template: ItemTemplate = ItemTemplate(
                uuid=uuid.uuid4(),
                type=field["type"],
                name=field["name"],
                created_by=get_request_user(request).id
            )
            # Check if we have non-required fields present
            if "defaultValue" in field:
                template.default_value = field["defaultValue"]
            if "isRequired" in field:
                template.is_required = field["isRequired"]
            if "isUnique" in field:
                template.is_unique = field["isUnique"]
            if "maxLength" in field:
                template.max_length = field["maxLength"]
            if "extra" in field:
                template.extra = field["extra"]
            if "format" in field:
                template.format = field["format"]

            # Validate the template

            # Add the template to the item_type
            item_type.templates.append(template.serialize())
        item_type.updated_at = datetime.now(pytz.utc)
        item_type.updated_by = get_request_user(request)
        item_type.save()
        return Response(data=successResponse(ItemTypeSerializer(item_type).data), status=status.HTTP_200_OK)
    except ItemType.DoesNotExist:
        return Response(data=errorResponse("Item does not exist.", "I0002"), status=status.HTTP_404_NOT_FOUND)


# Delete Item type field
# -------------------------------
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def delete_item_type_field(request, id):
    """
    Marks the field from the item type as deleted.

    Required json body:
    - template (string) - The template id to delete.
    """
    user = get_request_user(request)
    template = request.data['template']
    try:
        item_type: ItemType = ItemType.objects.get(id=id, created_by=user)
        # check if item_type has templates
        if item_type.templates is None or len(item_type.templates) < 1:
            return Response(data=errorResponse("No field to delete.", "I0010"), status=status.HTTP_400_BAD_REQUEST)
        templates: list[ItemTemplate] = [deserialize_item_template(t) for t in item_type.templates]
        # check if field is already deleted
        template_index = [str(t.uuid) for t in templates].index(template)
        if templates[template_index].is_deleted:
            return Response(data=errorResponse("Field already deleted.", "I0012"), status=status.HTTP_400_BAD_REQUEST)
        # mark the template as deleted
        templates[template_index].set_deleted(True, user.id)
        # serialize it again and save
        item_type.templates = [t.serialize() for t in templates]
        item_type.save()
        return Response(data=successResponse(ItemTypeSerializer(item_type).data), status=status.HTTP_200_OK)
    except ValueError:
        # raise by .index(template) if template not found
        return Response(data=errorResponse("Field not found.", "I0011"), status=status.HTTP_400_BAD_REQUEST)
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
def get_all_items(request, item_type_id):
    result = list()
    # Check if item type exists
    try:
        item_type = ItemType.objects.get(id=item_type_id, created_by=get_request_user(request))
    except ItemType.DoesNotExist:
        return Response(data=errorResponse("ItemType does not exist.", "I0013"), status=status.HTTP_404_NOT_FOUND)
    templates = [deserialize_item_template(t) for t in item_type.templates]
    # for each item row, we need to get the template values
    items = Item.objects.filter(item_type=item_type_id)
    for item in items:
        # get the template values
        result.append(ItemSerializer(item).read(templates))
    return Response(data=successResponse(result), status=status.HTTP_200_OK)


# Add new Item
# -----------------------------------------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_item(request):
    user = get_request_user(request)
    # get item type
    item_type_id = request.data['item_type']
    try:
        item_type = ItemType.objects.get(id=item_type_id, created_by=get_request_user(request))
    except ItemType.DoesNotExist:
        return Response(data=errorResponse("ItemType does not exist.", "I0015"), status=status.HTTP_404_NOT_FOUND)
    # get templates from item type
    templates = [deserialize_item_template(t) for t in item_type.templates]
    # get user provided values for templates
    user_template_values: list[ItemValue] = []
    for values in request.data['templates_value']:
        # fields - template (uuid string), value (string)
        template_id = values['template']
        template_value = values['value']
        template_used = [t for t in templates if str(t.uuid) == template_id]
        # check if template exists
        if len(template_used) == 0:
            return Response(data=errorResponse("Template not found.", "I0016"), status=status.HTTP_400_BAD_REQUEST)
        try:
            user_template_values.append(ItemValue(template_value, template_used[0]))
        except Exception as e:
            # exception can be raised if the template or value is not valid
            return Response(data=errorResponse(str(e), "I0017"), status=status.HTTP_400_BAD_REQUEST)
    # create serializer
    item_serializer = ItemSerializer(data=dict(
        name=request.data['name'],
        templates_value=json.dumps([t.serialize() for t in user_template_values]),
        item_type=request.data['item_type'],
        created_by=user.id,
        created_at=datetime.now(pytz.utc),
        updated_at=None,
        updated_by=None
    ))
    # if valid then add
    if item_serializer.is_valid():
        item_serializer.save()
        return Response(data=successResponse(item_serializer.read(templates)), status=status.HTTP_201_CREATED)
    else:
        return Response(data=errorResponse(item_serializer.errors), status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_item(request, id):
    try:
        item = Item.objects.get(id=id, created_by=get_request_user(request))
        templates = [deserialize_item_template(t) for t in item.item_type.templates]
        return Response(data=successResponse(ItemSerializer(item).read(templates)), status=status.HTTP_200_OK)
    except Item.DoesNotExist:
        return Response(data=errorResponse("Item does not exist.", "I0404"), status=status.HTTP_404_NOT_FOUND)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_item(request, id):
    try:
        Item.objects.get(id=id, created_by=get_request_user(request)).delete()
        return Response(data=successResponse(), status=status.HTTP_200_OK)
    except Item.DoesNotExist:
        return Response(data=errorResponse("Item does not exist.", "I0404"), status=status.HTTP_404_NOT_FOUND)
