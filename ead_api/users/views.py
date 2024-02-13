import pytz
import uuid
from datetime import datetime
from django.shortcuts import render
# RestFramework
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
# Serializers
from .serializers import UserSerializer
from .models import User
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
        id=uuid.uuid4(),
        name=str(request.data['name'])[0:64],
        email=str(request.data['email'])[0:64].lower(),
        phone=str(request.data['phone'])[0:20],
        role=str(request.data['role'])[0:64],
        notes=None,
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
        user.name = str(request.data['name'])[0:48]
        user.role = str(request.data['role'])[0:48]
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


# Post a note
@api_view(['POST'])
def postNoteToUser(request, id):
    # Get requesting admin ID
    admin = getAdminID(request)
    if type(admin) is Response:
        return admin
    # Update
    try:
        user = User.objects.get(id=id)
        notes = user.notes
        if notes is None:
            notes = []
        note = dict(
            date=str(datetime.now(pytz.utc)),
            author=admin.username,
            content=request.data['content'],
            id=(notes[-1]['id'] + 1) if len(notes) > 0 else 0
        )
        notes.append(note)
        user.notes = notes
        user.save()

        return Response(data=successResponse(UserSerializer(user).data), status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response(data=errorResponse("Unable to add user note.", "USR0004"), status=status.HTTP_400_BAD_REQUEST)


# Note Operations
# -------------------------------------------------------------------
@api_view(['PUT', 'DELETE'])
def noteOperations(request, id, noteid):
    if request.method == 'PUT':
        return updateNoteFromUser(request, id, noteid)
    elif request.method == 'DELETE':
        return deleteNoteFromUser(request, id, noteid)
    else:
        return Response(data=errorResponse("Invalid request method.", "USR0008"), status=status.HTTP_400_BAD_REQUEST)


# Delete a note
def deleteNoteFromUser(request, id, noteid):
    # Get requesting admin ID
    admin = getAdminID(request)
    if type(admin) is Response:
        return admin
    # Update
    try:
        user = User.objects.get(id=id)
        notes = user.notes
        for note in notes:
            if note['id'] == int(noteid):
                # If author is not the same or root, return error
                if admin.username != 'root':
                    if note['author'] != admin.username:
                        return Response(data=errorResponse("Unable to delete user note.", "USR0007"), status=status.HTTP_400_BAD_REQUEST)
                notes.remove(note)
                break
        user.notes = notes
        user.save()

        return Response(data=successResponse(UserSerializer(user).data), status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response(data=errorResponse("Unable to delete user note.", "USR0005"), status=status.HTTP_400_BAD_REQUEST)


# Update note
def updateNoteFromUser(request, id, noteid):
    # Get requesting admin ID
    admin = getAdminID(request)
    if type(admin) is Response:
        return admin
    # Update
    try:
        user = User.objects.get(id=id)
        notes = user.notes
        for note in notes:
            if note['id'] == int(noteid):
                # If author is not the same, return error
                if note['author'] != admin.username:
                    return Response(data=errorResponse("Unable to update user note.", "USR0007"), status=status.HTTP_400_BAD_REQUEST)
                note['content'] = request.data['content']
                break
        user.notes = notes
        user.save()

        return Response(data=successResponse(UserSerializer(user).data), status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response(data=errorResponse("Unable to update user note.", "USR0006"), status=status.HTTP_400_BAD_REQUEST)
