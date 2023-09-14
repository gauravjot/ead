from rest_framework import serializers
from .models import Item, ItemType, Allocation


class ItemTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemType
        fields = ['id', 'name', 'description', 'template', 'created_by', 'created_at']
        extra_kwargs = {
            'name': {'required': True},
            'description': {'required': True},
        }


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ['id', 'item_type', 'description', 'name', 'value', 'active']
        extra_kwargs = {
            'name': {'required': True},
            'description': {'required': True}, 
            'value': {'required': True},
            'item_type': {'required': True},
        }


class AllocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Allocation
        fields = ['id', 'item', 'notes', 'assigned_at', 'assigned_by',
                  'assigned_to', 'returned_at', 'collected_by']
        extra_kwargs = {
            'item': {'required': True},
            'assigned_by': {'required': True},
            'assigned_to': {'required': True},
            'assigned_at': {'required': True},
        }

