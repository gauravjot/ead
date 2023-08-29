import pytz
import json
import uuid
from datetime import datetime
# Security
import bcrypt
from secrets import token_hex
# RestFramework
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
# Models & Serializers
from .models import Admin
from .serializers import AdminSerializer
# Session
from .sessions import issueToken, dropSession
from .utils import tokenResponse, errorResponse, successResponse, hashThis

# Sign Up function
# -----------------------------------------------
@api_view(['POST'])
def register(request):
    # -- user data & hash password
    dateStamp = datetime.now(pytz.utc)

    # Check if username is available to register
    if Admin.objects.filter(username=str(request.data['username']).lower()).first():
        return Response(data=errorResponse("Username already exists.","A0099"), status=status.HTTP_400_BAD_REQUEST)

    adminSerializer = AdminSerializer(data=dict(
        full_name=str(request.data['full_name']),
        username=str(request.data['username']).lower(),
        password=hashPwd(str(request.data['password'])),
        title=str(request.data['title']),
        created_at=dateStamp,
        updated_at=dateStamp,
        active=True
    ))

    # -- check if data is without bad actors
    if adminSerializer.is_valid():
        adminSerializer.save()

        # send token to user
        token = issueToken(adminSerializer.data['username'])
        return Response(data=successResponse({"admin": adminSerializer.data, **tokenResponse(token)}), status=status.HTTP_201_CREATED)
    else:
        return Response(data=errorResponse(adminSerializer.errors), status=status.HTTP_400_BAD_REQUEST)

# Log In function, requires email and password
# -----------------------------------------------
@api_view(['POST'])
def login(request):
    username = str(request.data['username']).lower()
    password = str(request.data['password'])

    # Check if credentials are correct
    try:
        user = Admin.objects.get(username=username)
        if bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')) == False:
            return Response(data=errorResponse("Error: A0004. Credentials are invalid.", "A0004"), status=status.HTTP_401_UNAUTHORIZED)
    except Admin.DoesNotExist:
        return Response(data=errorResponse("Error: A0004. Credentials are invalid.", "A0004"), status=status.HTTP_401_UNAUTHORIZED)
    # send token to user
    token = issueToken(username)
    return Response(data=successResponse({"admin": AdminSerializer(user).data, **tokenResponse(token)}), status=status.HTTP_202_ACCEPTED)

# Log Out function, requires token
# -----------------------------------------------
@api_view(['DELETE'])
def logout(request):
    # Invalidate the token
    dropSession(request)
    return Response(data=successResponse(), status=status.HTTP_200_OK)


# Helper Functions
# -----------------------------------------------

def hashPwd(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
