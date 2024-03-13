import pytz
from datetime import datetime
from django.shortcuts import render
# RestFramework
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
# Serializers
from .serializers import UserSerializer, NoteSerializer
from .models import User, Note
from admins.sessions import getAdminID
from admins.utils import errorResponse, successResponse


# Get all users
@api_view(['GET'])
def getAllUsers(request):
    # Get requesting admin ID
    admin = getAdminID(request)
    if type(admin) is Response:
        return admin
    return Response(data=successResponse(UserSerializer(User.objects.all().order_by('name'), many=True).data), status=status.HTTP_200_OK)


# Search users
@api_view(['POST'])
def searchUser(request):
    # Get requesting admin ID
    admin = getAdminID(request)
    if type(admin) is Response:
        return admin
    return Response(data=successResponse(UserSerializer(User.objects.filter(name__icontains=str(request.data['keyword'])).order_by('name'), many=True).data), status=status.HTTP_200_OK)


# Create user
@api_view(['POST'])
def addUser(request):
    # Get requesting admin ID
    admin = getAdminID(request)
    if type(admin) is Response:
        return admin
    # Add user
    dateStamp = datetime.now(pytz.utc)
    userSerializer = UserSerializer(data=dict(
        name=str(request.data['name'])[0:64],
        email=str(request.data['email'])[0:64].lower(),
        phone=str(request.data['phone'])[0:20],
        title=str(request.data['title'])[0:64],
        created_at=dateStamp,
        updated_at=dateStamp,
        created_by=admin.username,
        updated_by=admin.username
    ))

    # -- check if data is without bad actors
    if userSerializer.is_valid():
        userSerializer.save()
        return Response(data=successResponse(userSerializer.data), status=status.HTTP_201_CREATED)
    else:
        return Response(data=errorResponse(userSerializer.errors), status=status.HTTP_400_BAD_REQUEST)


# User Operations
# -------------------------------------------------------------------
@api_view(['PUT', 'DELETE', 'GET'])
def userOperations(request, id):
    if request.method == 'GET':
        return getUser(request, id)
    elif request.method == 'PUT':
        return updateUser(request)
    elif request.method == 'DELETE':
        return deleteUser(request, id)
    else:
        return Response(data=errorResponse("Invalid request method.", "USR0000"), status=status.HTTP_400_BAD_REQUEST)


# Read
def getUser(request, id):
    # Get requesting admin ID
    admin = getAdminID(request)
    if type(admin) is Response:
        return admin
    # Get user
    try:
        user = User.objects.get(id=id)
        return Response(data=successResponse(UserSerializer(user).data), status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response(data=errorResponse("User does not exist.", "USR0001"), status=status.HTTP_404_NOT_FOUND)


# Update
def updateUser(request):
    # Get requesting admin ID
    admin = getAdminID(request)
    if type(admin) is Response:
        return admin
    # Update
    try:
        user = User.objects.get(id=request.data['uid'])
        user.name = str(request.data['name'])[0:64]
        user.title = str(request.data['title'])[0:64]
        user.email = str(request.data['email'])[0:64]
        user.phone = str(request.data['phone'])[0:20]
        user.updated_at = datetime.now(pytz.utc)
        user.updated_by = admin
        user.save()

        return Response(data=successResponse(UserSerializer(user).data), status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response(data=errorResponse("Unable to update user.", "USR0002"), status=status.HTTP_400_BAD_REQUEST)


# Disable/Delete
def deleteUser(request, id):
    # Get requesting admin ID
    admin = getAdminID(request)
    if type(admin) is Response:
        return admin
    # Delete
    try:
        User.objects.get(id=id).delete()
        return Response(data=successResponse(), status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response(data=errorResponse("User does not exist.", "USR0003"), status=status.HTTP_404_NOT_FOUND)


# Get all users
@api_view(['GET'])
def getUserNotes(request, id):
    # Get requesting admin ID
    admin = getAdminID(request)
    if type(admin) is Response:
        return admin
    return Response(data=successResponse(NoteSerializer(Note.objects.filter(user=id).order_by('-updated_at'), many=True).data), status=status.HTTP_200_OK)


# Post a note
@api_view(['POST'])
def postNoteToUser(request, id):
    # Get requesting admin ID
    admin = getAdminID(request)
    if type(admin) is Response:
        return admin
    # Add user
    dateStamp = datetime.now(pytz.utc)
    noteSerializer = NoteSerializer(data=dict(
        user=int(id),
        note=str(request.data['content']),
        created_at=dateStamp,
        updated_at=dateStamp,
        created_by=admin.username,
        updated_by=admin.username
    ))

    # -- check if data is without bad actors
    if noteSerializer.is_valid():
        noteSerializer.save()
        return Response(data=successResponse(noteSerializer.data), status=status.HTTP_201_CREATED)
    else:
        return Response(data=errorResponse(noteSerializer.errors), status=status.HTTP_400_BAD_REQUEST)


# Note Operations
# -------------------------------------------------------------------
@api_view(['PUT', 'DELETE'])
def noteOperations(request, id, noteid):
    if request.method == 'PUT':
        return updateNoteFromUser(request, noteid)
    elif request.method == 'DELETE':
        return deleteNoteFromUser(request, noteid)
    else:
        return Response(data=errorResponse("Invalid request method.", "USR0008"), status=status.HTTP_400_BAD_REQUEST)


# Delete a note
def deleteNoteFromUser(request, noteid):
    # Get requesting admin ID
    admin = getAdminID(request)
    if type(admin) is Response:
        return admin
    try:
        note = Note.objects.get(id=noteid)
        if admin.username != 'root':
            if note.created_by != admin:
                return Response(data=errorResponse("Unable to delete user note.", "USR0011"), status=status.HTTP_400_BAD_REQUEST)
        note.delete()
        return Response(data=successResponse(), status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response(data=errorResponse("Unable to delete user note.", "USR0005"), status=status.HTTP_404_NOT_FOUND)


# Update note
def updateNoteFromUser(request, noteid):
    # Get requesting admin ID
    admin = getAdminID(request)
    if type(admin) is Response:
        return admin
    # Update
    try:
        note = Note.objects.get(id=noteid)
        if admin.username != 'root':
            if note.created_by != admin:
                return Response(data=errorResponse("Unable to update user note.", "USR0007"), status=status.HTTP_400_BAD_REQUEST)
        note.note = request.data['content']
        note.save()
        return Response(data=successResponse(NoteSerializer(note).data), status=status.HTTP_200_OK)
    except Note.DoesNotExist:
        return Response(data=errorResponse("Unable to delete user note.", "USR0006"), status=status.HTTP_404_NOT_FOUND)
