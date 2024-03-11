from rest_framework import serializers
from .models import Item, ItemType


class ItemTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemType
        fields = ['id', 'name', 'description', 'template',
                  'created_by', 'created_at', 'updated_by',
                  'updated_at']
        extra_kwargs = {
            'name': {'required': True},
            'description': {'required': True},
            'created_by': {'required': True},
            'created_at': {'required': True},
        }


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ['id', 'item_type', 'name',
                  'value', 'added_by', 'added_at', 'updated_by',
                  'updated_at']
        extra_kwargs = {
            'name': {'required': True},
            'value': {'required': True},
            'item_type': {'required': True},
            'added_by': {'required': True},
            'added_at': {'required': True},
        }
