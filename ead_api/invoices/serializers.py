from rest_framework import serializers
from .models import Client


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ['id', 'name', 'type', 'email', 'phone', 'notes',
                  'street', 'city', 'province', 'postal_code', 'country', 'vat',
                  'created_at', 'created_by', 'updated_at', 'updated_by']
        extra_kwargs = {
            'name': {'required': True},
            'notes': {'required': False},
            'street': {'required': False},
            'city': {'required': False},
            'province': {'required': False},
            'postal_code': {'required': False},
            'vat': {'required': False},
        }
