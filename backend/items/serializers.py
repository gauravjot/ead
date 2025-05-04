import json
from rest_framework import serializers
from .models import Item, ItemType
from .objs.item_template import ItemTemplate
from .objs.item import ItemValue
from utils.user_serializer import UserSerializer


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
    created_by_user = UserSerializer(source='created_by', read_only=True)
    updated_by_user = UserSerializer(source='updated_by', read_only=True)

    class Meta:
        model = Item
        fields = ['id', 'item_type', 'name', 'templates_value', 'created_by',
                  'created_by_user', 'created_at', 'updated_by', 'updated_by_user', 'updated_at']
        extra_kwargs = {
            'name': {'required': True},
            'templates_value': {'required': True},
            'item_type': {'required': True},
            'created_by': {'required': True, 'write_only': True},
            'created_at': {'required': True},
            'updated_by': {'write_only': True},
        }

    def read(self, templates: list[ItemTemplate], formatting=True, filter_deleted: bool = True) -> list[ItemValue]:
        """
        Read the templates and return the values.
        """
        result = dict(**self.data)
        result['templates_value'] = []
        # match the templates_value with the provided list of templates
        for template in templates:
            # check if the template is deleted
            if filter_deleted and template.is_deleted:
                continue
            for item in json.loads(self.data['templates_value']):
                if str(template.uuid) == item['template']:  # compare uuids to match
                    item_value = ItemValue(item['value'], template).serialize(formatting=formatting)
                    result['templates_value'].append(item_value)
        return result
