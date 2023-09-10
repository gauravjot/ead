from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'title', 'email', 'phone',
                  'created_at', 'created_by', 'updated_at', 'updated_by']
        extra_kwargs = {
            'name': {'required': True},
        }
