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
    # Check if token is present in header
    try:
        token = request.headers['Authorization'].split()[-1]
        if len(token) < 48:
            raise KeyError
    except KeyError:
        return Response(errorResponse("Unauthorized.", "A1001"), status=status.HTTP_401_UNAUTHORIZED)
    # Check if token is present in database and is valid
    try:
        session = Session.objects.get(token=hashThis(token))
        # Return admin id if token is valid
        if session.valid:
            return session.admin
        else:
            return Response(errorResponse("Unauthorized.", "A1002"), status=status.HTTP_401_UNAUTHORIZED)
    except Session.DoesNotExist:
        return Response(errorResponse("Unauthorized.", "A1003"), status=status.HTTP_401_UNAUTHORIZED)

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
        return newToken

# Invalidate a token
def dropSession(request):
    try:
        session = Session.objects.get(token=hashThis(
            request.headers['Authorization'].split()[-1]))
        session.valid = False
        session.save()
    except Session.DoesNotExist:
        pass
