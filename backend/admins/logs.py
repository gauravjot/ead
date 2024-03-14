# RestFramework
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
# Models & Serializers
from .models import Log
from .serializers import LogSerializer
# Session
from .sessions import getAdminID


@api_view(['GET'])
def getAllAdminLogs(request, admin_id):
    # Get requesting admin ID
    admin = getAdminID(request)
    if type(admin) is Response:
        return admin
    # Get logs
    logs = Log.objects.filter(
        action__icontains="[admin: "+admin_id+"]").exclude(actioned_by=admin_id).order_by('-actioned_at')
    return Response(data=LogSerializer(logs, many=True).data, status=status.HTTP_200_OK)


@api_view(['GET'])
def getAllAdminLogsActionedBy(request, admin_id):
    # Get requesting admin ID
    admin = getAdminID(request)
    if type(admin) is Response:
        return admin
    # Get logs
    logs = Log.objects.filter(
        actioned_by=admin_id).order_by('-actioned_at')
    return Response(data=LogSerializer(logs, many=True).data, status=status.HTTP_200_OK)
