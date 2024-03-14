from .models import Log, Admin
from datetime import datetime
import pytz
# Security
import hashlib


def errorResponse(message, actionCode="A0"):
    return dict(success=False, message=message, code=str(actionCode))


def successResponse(payload=dict()):
    return dict(success=True, data=payload)


def hashThis(value):
    return hashlib.sha256(str(value).encode('utf-8')).hexdigest()


def logThis(admin, resource_type: str, resource_id: str | int, action: str, changes: str):
    """Logs actions to the database

    Args:
        admin (Admin): Admin who is performing the action

        resource_type ( 'user' | 'item_type' | 'item' | 'admin' ): The resource that is being actioned

        resource_id (id): The id of the resource. For `item` use -> `item_type_id``_``item_id`

        action ( 'update' | 'delete' etc ): Short description of the action

        changes (string): A string representation of the changes made.
            Eg. "Changed name from 'John Doe' to 'Jane Doe'"

    Format:
        [resource_type: resource_id] [Action: action] [Changes: changes]
    """
    log_string = f"[{resource_type}: {str(resource_id)}] [Action: {action}] [Changes: {changes}]"

    if type(admin) == str:
        admin = Admin.objects.get(username=admin)

    Log.objects.create(
        action=log_string,
        actioned_by=admin,
        actioned_at=datetime.now(pytz.utc)
    )
