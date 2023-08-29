from rest_framework import serializers
from .models import Admin, Session


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'verified',
                  'password', 'created', 'updated']
        extra_kwargs = {
            'password': {'write_only': True, 'required': True},
            'email': {'required': True},
            'created': {'write_only': True},
            'updated': {'write_only': True}
        }


class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = ['id', 'token', 'user', 'expire',
                  'valid', 'created', 'ip', 'ua']
        extra_kwargs = {
            'token': {'required': True},
            'user': {'required': True},
        }
