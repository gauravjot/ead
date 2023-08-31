import pytz
import uuid
from datetime import datetime
from django.shortcuts import render
# RestFramework
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from admins.sessions import getAdminID
# Serializers
from .serializers import UserSerializer


# Create
# -------------------------------

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
        name=str(request.data['name'])[0:48],
        email=str(request.data['email'])[0:64].lower(),
        phone=str(request.data['phone'])[0:20],
        title=str(request.data['title'])[0:48],
        created_at=dateStamp,
        updated_at=dateStamp,
        created_by=admin
    ))

    # -- check if data is without bad actors
    if userSerializer.is_valid():
        userSerializer.save()
        return Response(data=successResponse({"user": userSerializer.data}), status=status.HTTP_201_CREATED)
    else:
        return Response(data=errorResponse(userSerializer.errors), status=status.HTTP_400_BAD_REQUEST)


# Read
# -------------------------------

@api_view(['GET'])
def getUser(request):
    # Get requesting admin ID
    admin = getAdminID(request)
    if type(admin) is Response:
        return admin
    # Get user 
    try:
        user = User.objects.get(id=request['uid'])
        return Response(data=successResponse(UserSerializer(user).data), status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response(data=errorResponse("User does not exist.", "U0001"), status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def getAllUsers(request):
    # Get requesting admin ID
    admin = getAdminID(request)
    if type(admin) is Response:
        return admin
    return Response(data=successResponse(UserSerializer(User.objects.all().order_by('name'), many=True).data), status=status.HTTP_200_OK)


@api_view(['POST'])
def searchUser(request):
    # Get requesting admin ID
    admin = getAdminID(request)
    if type(admin) is Response:
        return admin
    return Response(data=successResponse(UserSerializer(User.objects.filter(name__icontains=str(request.data['keyword'])).order_by('name'), many=True).data), status=status.HTTP_200_OK)


# Update
# -------------------------------

@api_view(['PUT'])
def updateUser(request):
    # Get requesting admin ID
    admin = getAdminID(request)
    if type(admin) is Response:
        return admin
    # Update
    try:
        user = User.objects.get(id=request.data['uid'])
        user.name = str(request.data['name'])[0:48]
        user.title = str(request.data['title'])[0:48]
        user.email = str(request.data['email'])[0:64]
        user.phone = str(request.data['phone'])[0:20]
        user.updated_at = datetime.now(pytz.utc)
        user.save()

        return Response(data=successResponse(UserSerializer(user).data), status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response(data=errorResponse("Unable to update user.", "U0002"), status=status.HTTP_400_BAD_REQUEST)



# Disable
# -------------------------------

@api_view(['DELETE'])
def deleteUser(request):
    # Get requesting admin ID
    admin = getAdminID(request)
    if type(admin) is Response:
        return admin
    # Delete user
    try:
        User.objects.get(id=request.data['uid']).delete()
        return Response(data=successResponse(), status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response(data=errorResponse("User does not exist.","N0003"), status=status.HTTP_404_NOT_FOUND)
