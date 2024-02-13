from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'role', 'email', 'phone', 'notes',
                  'created_at', 'created_by', 'updated_at', 'updated_by']
        extra_kwargs = {
            'name': {'required': True},
            'notes': {'required': False},
            'role': {'required': False},
            'email': {'required': True},
        }
