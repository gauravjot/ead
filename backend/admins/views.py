import pytz
from datetime import datetime, timedelta
from decouple import config
from django.db import connection
# Security
import bcrypt
# RestFramework
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
# Models & Serializers
from .models import Admin, Session
from .serializers import AdminSerializer
from users.models import User
from users.serializers import UserSerializer
# Session
from .sessions import issueToken, dropSession, getAdminID, getSessonID
from .utils import errorResponse, successResponse


# First time setup
# -----------------------------------------------
@api_view(['POST'])
def initialSetup(request):
    if Admin.objects.exists():
        return Response(data=errorResponse("Initial setup is already done. If you have lost the root password, then make a new server instance.", "A0089"), status=status.HTTP_400_BAD_REQUEST)
    # Check if password is provided
    if "password" not in request.data:
        return Response(data=errorResponse("Password is required.", "A0090"), status=status.HTTP_400_BAD_REQUEST)
    # Initialize
    dateStamp = datetime.now(pytz.utc)
    # Make a starter profile
    user = User.objects.create(
        name="Root",
        email="root@localhost",
        title="Global Admin",
        created_at=dateStamp,
        updated_at=dateStamp,
        created_by=None,
        updated_by=None
    )
    user.save()
    admin = Admin.objects.create(
        username="root",
        password=hashPwd(str(request.data['password'])),
        created_at=dateStamp,
        updated_at=dateStamp,
        created_by=None,
        updated_by=None,
        active=True,
    )
    # -- check if data is without bad actors
    admin.save()
    user.is_admin = admin
    user.save()
    # send token to user
    token, session_id = issueToken(admin.username)
    response = Response(data=successResponse({
        "admin": AdminSerializer(admin).data,
        "user": UserSerializer(user).data,
        "session_id": session_id
    }), status=status.HTTP_201_CREATED)
    response.set_cookie(
        key='auth_token',
        value=token,
        expires=datetime.now(pytz.utc) + timedelta(days=30),
        httponly=True,
        secure=config('AUTH_COOKIE_SECURE', default=False),
        samesite=config('AUTH_COOKIE_SAMESITE', default='Strict'),
        domain=config('AUTH_COOKIE_DOMAIN', default='localhost')
    )
    return response


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

    # Check if this admin needs to be connected to a user
    user = None
    if "connect_to" in request.data:
        try:
            user = User.objects.get(id=request.data['connect_to'])
        except User.DoesNotExist:
            return Response(data=errorResponse("User does not exist.", "A0091"), status=status.HTTP_404_NOT_FOUND)

    if user is None:
        user = User.objects.create(
            name=str(request.data['full_name']),
            email=str(request.data['email']),
            title=str(request.data['title']),
            created_at=dateStamp,
            updated_at=dateStamp,
            created_by=adminID,
            updated_by=adminID
        )
        user.save()

    # -- check if data is without bad actors
    adminSerializer = AdminSerializer(data=dict(
        username=str(request.data['username']).lower(),
        password=hashPwd(str(request.data['password'])),
        created_at=dateStamp,
        updated_at=dateStamp,
        updated_by=adminID.username,
        active=True,
        created_by=adminID.username
    ))

    if adminSerializer.is_valid():
        admin = adminSerializer.save()
        user.is_admin = admin
        user.save()
        return Response(data=successResponse(), status=status.HTTP_201_CREATED)
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
    token, session_id = issueToken(username)
    try:
        response = Response(data=successResponse({
            "admin": AdminSerializer(admin).data,
            "user": UserSerializer(User.objects.get(is_admin=admin)).data,
            "session_id": session_id
        }), status=status.HTTP_202_ACCEPTED)
    except User.DoesNotExist:
        response = Response(data=successResponse({
            "admin": AdminSerializer(admin).data,
            "user": None,
            "session_id": session_id
        }), status=status.HTTP_202_ACCEPTED)
    response.set_cookie(
        key='auth_token',
        value=token,
        expires=datetime.now(pytz.utc) + timedelta(days=30),
        httponly=True,
        secure=config('AUTH_COOKIE_SECURE', default=False),
        samesite=config('AUTH_COOKIE_SAMESITE', default='Strict'),
        domain=config('AUTH_COOKIE_DOMAIN', default='localhost')
    )
    return response


# Log Out function, requires token
# -----------------------------------------------
@api_view(['DELETE'])
def logout(request):
    # Invalidate the token
    dropSession(request)
    response = Response(data=successResponse(), status=status.HTTP_200_OK)
    response.delete_cookie(
        key='auth_token',
        domain=config('AUTH_COOKIE_DOMAIN', default='localhost')
    )
    return response


# Current Admin Info function, requires token
# -----------------------------------------------
@api_view(['GET'])
def me(request):
    admin = getAdminID(request)
    if type(admin) is Response:
        return admin
    session_id = getSessonID(request)
    if type(session_id) is Response:
        return session_id
    try:
        return Response(data=successResponse({
            "admin": AdminSerializer(admin).data,
            "user": UserSerializer(User.objects.get(is_admin=admin)).data,
            "session_id": session_id
        }), status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response(data=successResponse({
            "admin": AdminSerializer(admin).data,
            "user": None,
            "session_id": session_id
        }), status=status.HTTP_200_OK)


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
    if adminID.username == str(request.data['username']):
        return Response(data=errorResponse("Cannot disable own account.", "A0095"), status=status.HTTP_400_BAD_REQUEST)
    try:
        # Switch account active to False
        otherAdmin = Admin.objects.get(username=str(request.data['username']))
        otherAdmin.active = False
        otherAdmin.updated_at = datetime.now(pytz.utc)
        otherAdmin.updated_by = adminID
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
    if adminID.username == str(request.data['username']):
        return Response(data=errorResponse("Cannot enable own account.", "A0086"), status=status.HTTP_400_BAD_REQUEST)
    try:
        # Switch account active to True
        otherAdmin = Admin.objects.get(username=str(request.data['username']))
        otherAdmin.active = True
        otherAdmin.updated_at = datetime.now(pytz.utc)
        otherAdmin.updated_by = adminID
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
        admin.updated_by = adminID
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
    # Block request to change root account unless root is requesting
    if adminID.username != "root":
        if str(request.data['username']) == "root":
            return Response(data=errorResponse("Cannot change password of root account.", "A0087"), status=status.HTTP_400_BAD_REQUEST)
    try:
        admin = Admin.objects.get(username=str(request.data['username']))
        admin.password = hashPwd(str(request.data['password']))
        admin.updated_at = datetime.now(pytz.utc)
        admin.updated_by = adminID
        admin.save()

        return Response(data=successResponse(), status=status.HTTP_200_OK)
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
        query = """
            SELECT
                admins_admin.username as admin_username,
                admins_admin.active as admin_active,
                admins_admin.created_at as admin_created_at,
                admins_admin.updated_at as admin_updated_at,
                admins_admin.created_by_id as admin_created_by,
                admins_admin.updated_by_id as admin_updated_by,
                users_user.id as user_id,
                users_user.name as user_name,
                users_user.email as user_email,
                users_user.phone as user_phone,
                users_user.created_at as user_created_at,
                users_user.updated_at as user_updated_at,
                users_user.created_by_id as user_created_by,
                users_user.updated_by_id as user_updated_by,
                users_user.title as user_title
            FROM admins_admin
            LEFT OUTER JOIN users_user ON admins_admin.username = users_user.is_admin_id
            WHERE admins_admin.username = %s LIMIT 1
        """
        with connection.cursor() as cursor:
            cursor.execute(query, (str(username),))
            row = cursor.fetchone()

            result = dict(
                username=row[0],
                active=row[1],
                created_at=row[2],
                updated_at=row[3],
                created_by=row[4],
                updated_by=row[5],
                user_id=row[6],
                user_name=row[7],
                user_email=row[8],
                user_phone=row[9],
                user_created_at=row[10],
                user_updated_at=row[11],
                user_created_by=row[12],
                user_updated_by=row[13],
                user_title=row[14],
            )
        return Response(data=successResponse(result), status=status.HTTP_200_OK)
    except Admin.DoesNotExist:
        return Response(data=errorResponse("Invalid session.", "A0098"), status=status.HTTP_400_BAD_REQUEST)


# Get all admins, requires token
# This is a custom query and one of the few places where raw SQL is used
# If you can use Django ORM to make this, then please do so
# and open a pull request
# -----------------------------------------------
@api_view(['GET'])
def getAllAdmins(request):
    # Authenticate
    adminID = getAdminID(request)
    if type(adminID) is Response:
        return adminID
    try:
        query = """
            SELECT
                admins_admin.username as admin_username,
                admins_admin.active as admin_active,
                admins_admin.created_at as admin_created_at,
                admins_admin.updated_at as admin_updated_at,
                admins_admin.created_by_id as admin_created_by,
                admins_admin.updated_by_id as admin_updated_by,
                users_user.id as user_id,
                users_user.name as user_name,
                users_user.email as user_email,
                users_user.phone as user_phone,
                users_user.created_at as user_created_at,
                users_user.updated_at as user_updated_at,
                users_user.created_by_id as user_created_by,
                users_user.updated_by_id as user_updated_by,
                users_user.title as user_title
            FROM admins_admin
            LEFT OUTER JOIN users_user ON admins_admin.username = users_user.is_admin_id
        """
        with connection.cursor() as cursor:
            cursor.execute(query)
            rows = cursor.fetchall()

            result = []
            for row in rows:
                result.append(dict(
                    username=row[0],
                    active=row[1],
                    created_at=row[2],
                    updated_at=row[3],
                    created_by=row[4],
                    updated_by=row[5],
                    user_id=row[6],
                    user_name=row[7],
                    user_email=row[8],
                    user_phone=row[9],
                    user_created_at=row[10],
                    user_updated_at=row[11],
                    user_created_by=row[12],
                    user_updated_by=row[13],
                    user_title=row[14],
                ))
            return Response(data=successResponse({"admins": result}), status=status.HTTP_200_OK)
    except Admin.DoesNotExist:
        return Response(data=errorResponse("No admins.", "A0093"), status=status.HTTP_404_NOT_FOUND)


# Helper Functions
# -----------------------------------------------

def hashPwd(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
