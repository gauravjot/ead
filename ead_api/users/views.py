from django.shortcuts import render
# RestFramework
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from admins.sessions import getAdminID


# Create
# -------------------------------

@api_view(['POST'])
def addUser(request):
    admin = getAdminID(request)
    pass

# Read
# -------------------------------

@api_view(['GET'])
def getUser(request):
    admin = getAdminID(request)
    pass

@api_view(['GET'])
def getAllUsers(request):
    admin = getAdminID(request)
    pass

@api_view(['POST'])
def searchUser(request):
    admin = getAdminID(request)
    pass

# Update
# -------------------------------

@api_view(['PUT'])
def updateUser(request):
    admin = getAdminID(request)
    pass

# Disable
# -------------------------------

@api_view(['DELETE'])
def disableUser(request):
    admin = getAdminID(request)
    pass

@api_view(['DELETE'])
def deleteUser(request):
    admin = getAdminID(request)
    pass
