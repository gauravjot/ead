import uuid
import json
from items.item_types import Types
from datetime import datetime
from decimal import Decimal


class ItemTemplate:
    """
    Process each template for the item type. This does not process template values, use {ItemValue} class for that.
    """

    def __init__(
            self,
            uuid: uuid.UUID,
            name: str,
            type: str,
            created_by: uuid.UUID,
            max_length: int | None = None,
            default_value: str | None = None,
            is_required: bool = False,
            is_unique: bool = False,
            extra: str | None = None,
            format: str | None = None,
            is_deleted: bool = False,
            deleted_at: datetime | None = None,
            deleted_by: uuid.UUID | None = None,
            updated_at: datetime | None = None,
            updated_by: uuid.UUID | None = None,
            created_at: datetime | None = datetime.now(),

    ):
        self.uuid = uuid
        self.name = name
        self.type = type
        self.max_length: int | None = max_length
        self.default_value: str | None = default_value
        self.is_required: bool = is_required
        self.extra: str | None = extra
        self.format: str | None = format  # for example, currency symbol, decimal places, etc.
        self.is_unique: bool = is_unique if is_unique else False
        self.is_deleted: bool = is_deleted
        self.deleted_at: datetime | None = deleted_at
        self.deleted_by: uuid.UUID | None = deleted_by
        self.created_at: datetime = created_at
        self.created_by: uuid.UUID = created_by
        self.updated_at: datetime | None = updated_at
        self.updated_by: uuid.UUID | None = updated_by

    def serialize(self):
        return {
            'uuid': str(self.uuid),
            'name': self.name,
            'default_value': self.default_value,
            'is_required': self.is_required,
            'is_unique': self.is_unique,
            'type': self.type,
            'max_length': self.max_length,
            'format': self.format,
            'extra': self.extra,
            'is_deleted': self.is_deleted,
            'deleted_at': self.deleted_at.isoformat() if self.deleted_at else None,
            'deleted_by': str(self.deleted_by) if self.deleted_by else None,
            'created_at': self.created_at.isoformat(),
            'created_by': str(self.created_by) if self.created_by else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'updated_by': str(self.updated_by) if self.updated_by else None,
        }

    def set_deleted(self, is_deleted: bool, deleted_by: uuid.UUID = None):
        self.is_deleted = is_deleted
        self.deleted_by = deleted_by if is_deleted else None
        self.deleted_at = datetime.now() if is_deleted else None

    def json_serialize(self):
        return json.dumps(self.serialize())

    def type_value(self, value):
        if self.type == Types.SHORT_TEXT:
            # short text follows max_length rule
            return str(value)
        elif self.type == Types.LONG_TEXT:
            # long text does not follow max_length rule
            return str(value)
        elif self.type == Types.NUMBER:
            return int(value)
        elif self.type == Types.DECIMAL:
            return Decimal(value)
        elif self.type == Types.BOOLEAN:
            return bool(value)
        elif self.type == Types.DATE:
            return datetime.strptime(value, '%Y-%m-%d').date()
        elif self.type == Types.TIME:
            return datetime.strptime(value, '%H:%M:%S').time()
        elif self.type == Types.DATETIME:
            return datetime.strptime(value, '%Y-%m-%d %H:%M:%S')
        elif self.type == Types.EMAIL:
            return value
        elif self.type == Types.URL:
            return value
        elif self.type == Types.PHONE:
            return value
        elif self.type == Types.PASSWORD:
            return value
        elif self.type == Types.MULTIPLE:
            return value.split(',')
        else:
            return None


def deserialize_item_template(data):
    """
    Deserialize the item template from a dictionary.
    """
    return ItemTemplate(
        uuid=uuid.UUID(data['uuid']),
        name=data['name'],
        type=data['type'],
        created_by=uuid.UUID(data['created_by']),
        max_length=data.get('max_length'),
        default_value=data.get('default_value'),
        is_required=data.get('is_required', False),
        is_unique=data.get('is_unique', False),
        extra=data.get('extra'),
        format=data.get('format'),
        is_deleted=data.get('is_deleted', False),
        deleted_at=datetime.fromisoformat(data['deleted_at']) if data['deleted_at'] else None,
        deleted_by=uuid.UUID(data['deleted_by']) if data['deleted_by'] else None,
        updated_at=datetime.fromisoformat(data['updated_at']) if data['updated_at'] else None,
        updated_by=uuid.UUID(data['updated_by']) if data['updated_by'] else None,
        created_at=datetime.fromisoformat(data['created_at']),
    )
