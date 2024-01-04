import pytz
import uuid
from datetime import datetime
from django.shortcuts import render
# RestFramework
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
# Serializers
from invoices.serializers import ClientSerializer
from invoices.models import Client
from admins.sessions import getAdminID
from admins.utils import errorResponse, successResponse


# Create
# -------------------------------

@api_view(['POST'])
def addClient(request):
    # Get requesting admin ID
    admin = getAdminID(request)
    if type(admin) is Response:
        return admin
    # Add client
    dateStamp = datetime.now(pytz.utc)
    clientSerializer = ClientSerializer(data=dict(
        id=uuid.uuid4(),
        name=str(request.data['name'])[0:64],
        email=str(request.data['email'])[0:64].lower(),
        phone=str(request.data['phone'])[0:20],
        type=str(request.data['type'])[0:48],
        street=str(request.data['street'])[0:128],
        city=str(request.data['city'])[0:128],
        province=str(request.data['province'])[0:128],
        postal_code=str(request.data['postal_code'])[0:16],
        country=str(request.data['country'])[0:128],
        vat=str(request.data['vat'])[0:16],
        notes=None,
        created_at=dateStamp,
        updated_at=dateStamp,
        created_by=admin.username,
        updated_by=admin.username
    ))

    # -- check if data is without bad actors
    if clientSerializer.is_valid():
        clientSerializer.save()
        return Response(data=successResponse(clientSerializer.data), status=status.HTTP_201_CREATED)
    else:
        return Response(data=errorResponse(clientSerializer.errors), status=status.HTTP_400_BAD_REQUEST)


# Read
# -------------------------------

@api_view(['GET'])
def getClient(request, id):
    # Get requesting admin ID
    admin = getAdminID(request)
    if type(admin) is Response:
        return admin
    # Get client
    try:
        client = Client.objects.get(id=id)
        return Response(data=successResponse(ClientSerializer(client).data), status=status.HTTP_200_OK)
    except Client.DoesNotExist:
        return Response(data=errorResponse("Client does not exist.", "CL0001"), status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def getAllClient(request):
    # Get requesting admin ID
    admin = getAdminID(request)
    if type(admin) is Response:
        return admin
    return Response(data=successResponse(ClientSerializer(Client.objects.all().order_by('name'), many=True).data), status=status.HTTP_200_OK)


@api_view(['POST'])
def searchClient(request):
    # Get requesting admin ID
    admin = getAdminID(request)
    if type(admin) is Response:
        return admin
    return Response(data=successResponse(ClientSerializer(Client.objects.filter(name__icontains=str(request.data['keyword'])).order_by('name'), many=True).data), status=status.HTTP_200_OK)


# Update
# -------------------------------

@api_view(['PUT'])
def updateClient(request):
    # Get requesting admin ID
    admin = getAdminID(request)
    if type(admin) is Response:
        return admin
    # Update
    try:
        client = Client.objects.get(id=request.data['uid'])
        client.name = str(request.data['name'])[0:48]
        client.type = str(request.data['type'])[0:48]
        client.email = str(request.data['email'])[0:64]
        client.phone = str(request.data['phone'])[0:20]
        client.street = str(request.data['street'])[0:128]
        client.city = str(request.data['city'])[0:128]
        client.province = str(request.data['province'])[0:128]
        client.postal_code = str(request.data['postal_code'])[0:16]
        client.country = str(request.data['country'])[0:128]
        client.vat = str(request.data['vat'])[0:16]
        client.updated_at = datetime.now(pytz.utc)
        client.updated_by = admin
        client.save()

        return Response(data=successResponse(ClientSerializer(client).data), status=status.HTTP_200_OK)
    except Client.DoesNotExist:
        return Response(data=errorResponse("Unable to update client.", "CL0002"), status=status.HTTP_400_BAD_REQUEST)


# Post a note
# -------------------------------
@api_view(['POST'])
def postNoteToClient(request):
    # Get requesting admin ID
    admin = getAdminID(request)
    if type(admin) is Response:
        return admin
    # Update
    try:
        client = Client.objects.get(id=request.data['uid'])
        notes = client.notes
        if notes is None:
            notes = []
        note = dict(
            date=str(datetime.now(pytz.utc)),
            author=admin.username,
            content=request.data['content'],
            id=(notes[-1]['id'] + 1) if len(notes) > 0 else 0
        )
        notes.append(note)
        client.notes = notes
        client.save()

        return Response(data=successResponse(ClientSerializer(client).data), status=status.HTTP_200_OK)
    except Client.DoesNotExist:
        return Response(data=errorResponse("Unable to add client note.", "CL0004"), status=status.HTTP_400_BAD_REQUEST)


# Delete a note
# -------------------------------
@api_view(['PUT'])
def deleteNoteFromClient(request):
    # Get requesting admin ID
    admin = getAdminID(request)
    if type(admin) is Response:
        return admin
    # Update
    try:
        client = Client.objects.get(id=request.data['uid'])
        notes = client.notes
        for note in notes:
            if note['id'] == request.data['nid']:
                # If author is not the same or root, return error
                if admin.username != 'root':
                    if note['author'] != admin.username:
                        return Response(data=errorResponse("Unable to delete client note.", "CL0007"), status=status.HTTP_400_BAD_REQUEST)
                notes.remove(note)
                break
        client.notes = notes
        client.save()

        return Response(data=successResponse(ClientSerializer(client).data), status=status.HTTP_200_OK)
    except Client.DoesNotExist:
        return Response(data=errorResponse("Unable to delete client note.", "U0005"), status=status.HTTP_400_BAD_REQUEST)


# Update note
# -------------------------------
@api_view(['PUT'])
def updateNoteFromClient(request):
    # Get requesting admin ID
    admin = getAdminID(request)
    if type(admin) is Response:
        return admin
    # Update
    try:
        client = Client.objects.get(id=request.data['uid'])
        notes = client.notes
        for note in notes:
            if note['id'] == request.data['nid']:
                # If author is not the same, return error
                if note['author'] != admin.username:
                    return Response(data=errorResponse("Unable to update client note.", "CL0007"), status=status.HTTP_400_BAD_REQUEST)
                note['content'] = request.data['content']
                break
        client.notes = notes
        client.save()

        return Response(data=successResponse(ClientSerializer(client).data), status=status.HTTP_200_OK)
    except Client.DoesNotExist:
        return Response(data=errorResponse("Unable to update client note.", "CL0006"), status=status.HTTP_400_BAD_REQUEST)


# Disable
# -------------------------------
@api_view(['DELETE'])
def deleteClient(request):
    # Get requesting admin ID
    admin = getAdminID(request)
    if type(admin) is Response:
        return admin
    # Delete
    try:
        Client.objects.get(id=request.data['uid']).delete()
        return Response(data=successResponse(), status=status.HTTP_200_OK)
    except Client.DoesNotExist:
        return Response(data=errorResponse("Client does not exist.", "CL0003"), status=status.HTTP_404_NOT_FOUND)
