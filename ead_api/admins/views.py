import pytz
from datetime import datetime
# Security
import bcrypt
# RestFramework
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
# Models & Serializers
from .models import Admin, Session
from .serializers import AdminSerializer
# Session
from .sessions import issueToken, dropSession, getAdminID
from .utils import tokenResponse, errorResponse, successResponse

# First time setup
# -----------------------------------------------


@api_view(['POST'])
def initialSetup(request):
    if Admin.objects.exists():
        return Response(data=errorResponse("Initial setup is already done. If you have lost the root password, then make a new server instance.", "A0089"), status=status.HTTP_400_BAD_REQUEST)
    # Initialize
    dateStamp = datetime.now(pytz.utc)
    adminSerializer = AdminSerializer(data=dict(
        full_name="Root",
        username="root",
        password=hashPwd(str(request.data['password'])),
        title="Global Administrative Account",
        created_at=dateStamp,
        updated_at=dateStamp,
        created_by="Intial setup",
        updated_by="Intial setup",
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


# Sign Up function
# -----------------------------------------------
@api_view(['POST'])
def register(request):
    adminID = getAdminID(request)
    if type(adminID) is Response:
        return adminID
    # -- user data & hash password
    dateStamp = datetime.now(pytz.utc)

    # Check if username is available to register
    if Admin.objects.filter(username=str(request.data['username']).lower()).first():
        return Response(data=errorResponse("Username already exists.", "A0099"), status=status.HTTP_400_BAD_REQUEST)

    adminSerializer = AdminSerializer(data=dict(
        full_name=str(request.data['full_name']),
        username=str(request.data['username']).lower(),
        password=hashPwd(str(request.data['password'])),
        title=str(request.data['title']),
        created_at=dateStamp,
        updated_at=dateStamp,
        updated_by=str(adminID.username),
        active=True,
        created_by=str(adminID.username)
    ))

    # -- check if data is without bad actors
    if adminSerializer.is_valid():
        adminSerializer.save()

        return Response(data=successResponse({"admin": adminSerializer.data}), status=status.HTTP_201_CREATED)
    else:
        return Response(data=errorResponse(adminSerializer.errors), status=status.HTTP_400_BAD_REQUEST)

# Log In function, requires email and password
# -----------------------------------------------


@api_view(['POST'])
def login(request):
    username = str(request.data['username']).lower()
    password = str(request.data['password'])

    try:
        admin = Admin.objects.get(username=username)
        # Check if credentials are correct
        if bcrypt.checkpw(password.encode('utf-8'), admin.password.encode('utf-8')) == False:
            return Response(data=errorResponse("Credentials are invalid.", "A0004"), status=status.HTTP_401_UNAUTHORIZED)
        # Check if admin account is active
        if admin.active == False:
            return Response(data=errorResponse("Account is disabled.", "A0096"), status=status.HTTP_401_UNAUTHORIZED)
    except Admin.DoesNotExist:
        return Response(data=errorResponse("Credentials are invalid.", "A0004"), status=status.HTTP_401_UNAUTHORIZED)
    # send token to user
    token = issueToken(username)
    return Response(data=successResponse({"admin": AdminSerializer(admin).data, **tokenResponse(token)}), status=status.HTTP_202_ACCEPTED)

# Log Out function, requires token
# -----------------------------------------------


@api_view(['DELETE'])
def logout(request):
    # Invalidate the token
    dropSession(request)
    return Response(data=successResponse(), status=status.HTTP_200_OK)


# Current Admin Info function, requires token
# -----------------------------------------------
@api_view(['GET'])
def me(request):
    adminID = getAdminID(request)
    if type(adminID) is Response:
        return adminID
    try:
        admin = Admin.objects.get(username=adminID)
        return Response(data=successResponse(AdminSerializer(admin).data), status=status.HTTP_200_OK)
    except Admin.DoesNotExist:
        return Response(data=errorResponse("Invalid session.", "A0098"), status=status.HTTP_400_BAD_REQUEST)


# Admin Info function, requires token, username
# -----------------------------------------------
@api_view(['GET'])
def adminInfo(request, username):
    adminID = getAdminID(request)
    if type(adminID) is Response:
        return adminID
    try:
        admin = Admin.objects.get(username=username)
        return Response(data=successResponse(AdminSerializer(admin).data), status=status.HTTP_200_OK)
    except Admin.DoesNotExist:
        return Response(data=errorResponse("Invalid session.", "A0098"), status=status.HTTP_400_BAD_REQUEST)


# Update Current Admin Info function, requires token
# -----------------------------------------------
@api_view(['PUT'])
def update(request):
    adminID = getAdminID(request)
    if type(adminID) is Response:
        return adminID
    try:
        admin = Admin.objects.get(username=adminID)
        admin.full_name = str(request.data['full_name'])
        admin.title = str(request.data['title'])
        admin.updated_at = datetime.now(pytz.utc)
        admin.updated_by = str(adminID.username)
        admin.save()

        return Response(data=successResponse(AdminSerializer(admin).data), status=status.HTTP_200_OK)
    except Admin.DoesNotExist:
        return Response(data=errorResponse("Invalid session.", "A0098"), status=status.HTTP_400_BAD_REQUEST)


# Update Current Admin Info function, requires token
# -----------------------------------------------
@api_view(['PUT'])
def updateAdmin(request):
    adminID = getAdminID(request)
    if type(adminID) is Response:
        return adminID
    try:
        admin = Admin.objects.get(username=str(request.data['username']))
        admin.full_name = str(request.data['full_name'])
        admin.title = str(request.data['title'])
        admin.updated_at = datetime.now(pytz.utc)
        admin.save()

        return Response(data=successResponse(AdminSerializer(admin).data), status=status.HTTP_200_OK)
    except Admin.DoesNotExist:
        return Response(data=errorResponse("Invalid session.", "A0098"), status=status.HTTP_400_BAD_REQUEST)


# Disable other Admin's account, requires token
# -----------------------------------------------
@api_view(['PUT'])
def disable(request):
    adminID = getAdminID(request)
    if type(adminID) is Response:
        return adminID
    # Block request to disable root account
    if str(request.data['username']) == "root":
        return Response(data=errorResponse("Cannot disable root account.", "A0088"), status=status.HTTP_400_BAD_REQUEST)
    # Block self-disabling
    if adminID == str(request.data['username']):
        return Response(data=errorResponse("Cannot disable own account.", "A0095"), status=status.HTTP_400_BAD_REQUEST)
    try:
        # Switch account active to False
        otherAdmin = Admin.objects.get(username=str(request.data['username']))
        otherAdmin.active = False
        otherAdmin.updated_at = datetime.now(pytz.utc)
        otherAdmin.updated_by = str(adminID.username)
        otherAdmin.save()

        # Disable all active sessions
        Session.objects.filter(admin=otherAdmin.username).update(valid=False)

        return Response(data=successResponse(), status=status.HTTP_200_OK)
    except Admin.DoesNotExist:
        return Response(data=errorResponse("Admin does not exist.", "A0097"), status=status.HTTP_404_NOT_FOUND)


# Enable other Admin's account, requires token, username
# -----------------------------------------------
@api_view(['PUT'])
def enable(request):
    adminID = getAdminID(request)
    if type(adminID) is Response:
        return adminID
    # Block self-enabling
    if adminID == str(request.data['username']):
        return Response(data=errorResponse("Cannot enaable own account.", "A0086"), status=status.HTTP_400_BAD_REQUEST)
    try:
        # Switch account active to True
        otherAdmin = Admin.objects.get(username=str(request.data['username']))
        otherAdmin.active = True
        otherAdmin.updated_at = datetime.now(pytz.utc)
        otherAdmin.updated_by = str(adminID.username)
        otherAdmin.save()

        # Disable all active sessions
        Session.objects.filter(admin=otherAdmin.username).update(valid=False)

        return Response(data=successResponse(), status=status.HTTP_200_OK)
    except Admin.DoesNotExist:
        return Response(data=errorResponse("Admin does not exist.", "A0097"), status=status.HTTP_404_NOT_FOUND)


# Change account password, requires token
# -----------------------------------------------
@api_view(['PUT'])
def changeMyPassword(request):
    adminID = getAdminID(request)
    if type(adminID) is Response:
        return adminID
    try:
        admin = Admin.objects.get(username=adminID)
        admin.password = hashPwd(str(request.data['password']))
        admin.updated_at = datetime.now(pytz.utc)
        admin.save()

        return Response(data=successResponse(), status=status.HTTP_200_OK)
    except Admin.DoesNotExist:
        return Response(data=errorResponse("Invalid session.", "A0098"), status=status.HTTP_400_BAD_REQUEST)


# Change other admin's account password, requires token
# -----------------------------------------------
@api_view(['PUT'])
def changePassword(request):
    adminID = getAdminID(request)
    if type(adminID) is Response:
        return adminID
    # Block request to change root account
    if str(request.data['username']) == "root":
        return Response(data=errorResponse("Cannot change password of root account.", "A0087"), status=status.HTTP_400_BAD_REQUEST)
    try:
        admin = Admin.objects.get(username=str(request.data['username']))
        admin.password = hashPwd(str(request.data['password']))
        admin.updated_at = datetime.now(pytz.utc)
        admin.save()

        return Response(data=successResponse(), status=status.HTTP_200_OK)
    except Admin.DoesNotExist:
        return Response(data=errorResponse("Invalid session.", "A0098"), status=status.HTTP_400_BAD_REQUEST)

# Change account password, requires token
# -----------------------------------------------


@api_view(['GET'])
def getAllAdmins(request):
    # Authenticate
    adminID = getAdminID(request)
    if type(adminID) is Response:
        return adminID
    try:
        admins = AdminSerializer(
            Admin.objects.all().order_by('full_name'), many=True)
        return Response(data=successResponse({"admins": admins.data}), status=status.HTTP_200_OK)
    except Admin.DoesNotExist:
        return Response(data=errorResponse("No admins.", "A0093"), status=status.HTTP_404_NOT_FOUND)

# Helper Functions
# -----------------------------------------------


def hashPwd(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
