import uuid
import json
from items.item_types import Types
from datetime import datetime
from decimal import Decimal


class ItemTemplate:
    """
    Process each template for the item type. This does not process template values, use {ItemValue} class for that.
    """

    def __init__(self, obj_uuid: uuid.UUID, name: str, obj_type: str, max_length: int = None, default_value: str = None, is_required: bool = False, extra: str = None, obj_format: str = None):
        self.uuid = obj_uuid
        self.name = name
        self.type = obj_type
        self.max_length = max_length
        self.default_value = default_value
        self.is_required = is_required
        self.extra = extra
        self.format = obj_format  # for example, currency symbol, decimal places, etc.

    def serialize(self):
        return {
            'uuid': str(self.uuid),
            'name': self.name,
            'default_value': self.default_value,
            'is_required': self.is_required,
            'type': self.type,
            'max_length': self.max_length,
            'format': self.format,
            'extra': self.extra
        }

    def json_serialize(self):
        return json.dumps(self.serialize())

    def type_value(self, value):
        if self.type == Types.SHORT_TEXT:
            return str(value)
        elif self.type == Types.LONG_TEXT:
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
