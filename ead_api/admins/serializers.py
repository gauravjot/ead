from rest_framework import serializers
from .models import Admin, Session


class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields = ['full_name', 'username', 'title', 'created_by', 'updated_by',
                  'active', 'password', 'created_at', 'updated_at']
        extra_kwargs = {
            'password': {'write_only': True, 'required': True},
            'username': {'required': True},
        }


class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = ['id', 'token', 'admin', 'valid', 'created_at']
        extra_kwargs = {
            'token': {'required': True, 'write_only': True},
            'admin': {'required': True},
        }
