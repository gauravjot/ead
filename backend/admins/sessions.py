import pytz
from datetime import datetime
# Security
from secrets import token_hex
# RestFramework
from rest_framework.response import Response
from rest_framework import status

# Models & Serializers
from .models import Session
from .serializers import SessionSerializer

from .utils import errorResponse, hashThis


# Get user id from request
def getAdminID(request):
    # Check if token in present in cookie
    try:
        token = request.COOKIES['auth_token']
        if len(token) < 48:
            raise KeyError
    except KeyError:
        return Response(errorResponse("Unauthorized.", "A1001"), status=status.HTTP_401_UNAUTHORIZED)
    # Check if token is present in database and is valid
    try:
        session = Session.objects.select_related(
            "admin").get(token=hashThis(token))
        # Return admin id if token is valid
        if session.valid and session.admin.active:
            return session.admin
        else:
            return Response(errorResponse("Unauthorized.", "A1002"), status=status.HTTP_401_UNAUTHORIZED)
    except Session.DoesNotExist:
        return Response(errorResponse("Unauthorized.", "A1003"), status=status.HTTP_401_UNAUTHORIZED)


# Get session id from request
def getSessonID(request):
    # Check if token in present in cookie
    try:
        token = request.COOKIES['auth_token']
        if len(token) < 48:
            raise KeyError
    except KeyError:
        return Response(errorResponse("Unauthorized.", "A1071"), status=status.HTTP_401_UNAUTHORIZED)

    try:
        session = Session.objects.get(token=hashThis(token))
        if session.valid:
            return session.id
    except Session.DoesNotExist:
        return None


# Create a token
def issueToken(username):
    newToken = token_hex(24)
    sessionSerializer = SessionSerializer(data=dict(
        token=hashThis(newToken),
        admin=username,
        created_at=datetime.now(pytz.utc)
    ))
    if sessionSerializer.is_valid():
        sessionSerializer.save()
        return newToken, sessionSerializer.data['id']


# Invalidate a token
def dropSession(request):
    try:
        token = request.COOKIES['auth_token']
    except KeyError:
        pass
    try:
        session = Session.objects.get(token=hashThis(token))
        session.valid = False
        session.save()
    except Session.DoesNotExist:
        pass
