from rest_framework import serializers
from .models import User, Note


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'title', 'email', 'phone', 'is_admin',
                  'created_at', 'created_by', 'updated_at', 'updated_by']
        extra_kwargs = {
            'name': {'required': True},
            'notes': {'required': False},
            'role': {'required': False},
            'email': {'required': True},
        }


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['id', 'user', 'note', 'created_at',
                  'created_by', 'updated_at', 'updated_by']
        extra_kwargs = {
            'note': {'required': True},
            'user': {'required': True},
        }
