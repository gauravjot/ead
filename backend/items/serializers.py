from rest_framework import serializers
from .models import Item, ItemType
import json
from .item_types import Types
from decimal import Decimal
from datetime import datetime
import locale
import uuid


class ItemTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemType
        fields = ['id', 'name', 'description', 'templates', 'created_by', 'created_at', 'updated_by', 'updated_at']
        extra_kwargs = {
            'name': {'required': True},
            'description': {'required': True},
            'created_by': {'required': True},
            'created_at': {'required': True},
        }


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ['id', 'item_type', 'name', 'templates_value', 'added_by', 'added_at', 'updated_by', 'updated_at']
        extra_kwargs = {
            'name': {'required': True},
            'templates_value': {'required': True},
            'item_type': {'required': True},
            'added_by': {'required': True},
            'added_at': {'required': True},
        }


class ItemTemplate:
    """
    Process each template for the item type. This does not process template values, use {ItemValue} class for that.
    """
    def __init__(self, obj_uuid: uuid.UUID, name:str, obj_type:str, max_length:int=None, default_value:str=None, is_required:bool=False, extra:str=None, obj_format:str=None):
        self.uuid = obj_uuid
        self.name = name
        self.type = obj_type
        self.max_length = max_length
        self.default_value = default_value
        self.is_required = is_required
        self.extra = extra
        self.format = obj_format # for example, currency symbol, decimal places, etc.

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


def validate_with_template(item_type: ItemTemplate, value: any):
    """
    Checks if template top level rules are satisfied. E.g. required, max length, etc.
    """
    if item_type.is_required and value is None:
        raise ValueError(f'{item_type.name} is required')
    # Type the value
    try:
        value = item_type.type_value(value)
    except ValueError:
        raise ValueError(f'{item_type.name} is invalid')
    # Check max length
    if item_type.max_length is not None and len(value) > item_type.max_length:
        raise ValueError(f'{item_type.name} is too long')
    return value


class ItemValue:
    """
    This class process value from the database and formats it for the frontend.
    """
    def __init__(self, value: any, template: ItemTemplate):
        self.value = value
        self.template = template

    def serialize(self):
        value = validate_with_template(self.template, self.value)
        return {
            'template_uuid': self.template.uuid,
            'value': self.template.type_value(value),
            'formatted_value': apply_formatting(self.template.type_value(value), self.template.format) if len(self.template.format) > 0 else value,
        }

    def json_serialize(self):
        return json.dumps(self.serialize())


def apply_formatting(value: any, obj_format: str) -> str:
    """
    Multiple formatting can be applied to the value.

    Guide:

    Only apply if value is an integer or decimal.
    Currency        -   CURRENCY{en-US}
    Decimal         -   DECIMAL{2}                              [IGNORED if CURRENCY or PERCENTAGE is present]
    Number Locale   -   NUM_LOCALE{en-US}                       [Ignored if CURRENCY is present]
    Percentage      -   PERCENTAGE{2}                           [IGNORED if CURRENCY is present]

    More than one formatting options can be applied to the value separated by a comma.
    For example: "DECIMAL{2},NUMBER_LOCALE{en-US}"
    """

    def extract_formatting(formatting: str):
        """
        Extract all the formatting options from the string and return a list of dictionaries.
        """
        format_list = []
        for fmt in formatting.split(','):
            name, val = fmt.split('{')
            val = val.rstrip('}')
            format_list.append({'name': name.strip(), 'value': val.strip()})
        # Apply our ignore rules
        if any(fmt['name'] == 'CURRENCY' for fmt in format_list):
            # If CURRENCY is present, ignore DECIMAL and NUM_LOCALE
            format_list = [fmt for fmt in format_list if fmt['name'] not in ['DECIMAL', 'NUM_LOCALE', 'PERCENTAGE']]
        elif any(fmt['name'] == 'PERCENTAGE' for fmt in format_list):
            # If PERCENTAGE is present, ignore DECIMAL
            format_list = [fmt for fmt in format_list if fmt['name'] not in ['DECIMAL']]
        # Order to apply formatting
        order = ['CURRENCY', 'DECIMAL', 'PERCENTAGE', 'NUM_LOCALE']
        return sorted(format_list, key=lambda x: order.index(x['name']) if x['name'] in order else len(order))

    if obj_format is None:
        return value

    format_list = extract_formatting(obj_format)
    if isinstance(value, (int, Decimal)):
        for fmt in format_list:
            if fmt['name'] == 'CURRENCY':
                locale.setlocale(locale.LC_ALL, fmt['value'])
                value = locale.currency(value, grouping=True)
                # Reset locale to default
                locale.setlocale(locale.LC_ALL, '')
            elif fmt['name'] == 'DECIMAL':
                decimal_places = int(fmt['value'])
                value = f"{value:.{decimal_places}f}"
            elif fmt['name'] == 'NUM_LOCALE':
                locale.setlocale(locale.LC_ALL, fmt['value'])
                value = f"{value:n}"
                # Reset locale to default
                locale.setlocale(locale.LC_ALL, '')
            elif fmt['name'] == 'PERCENTAGE':
                decimal_places = int(fmt['value'])
                value = f"{value:.{decimal_places}f}%"

    return value