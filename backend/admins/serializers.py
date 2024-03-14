from rest_framework import serializers
from .models import Admin, Session, Log, Permission, Role, RolePermission, AdminRole, AdminPermission


class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields = ['username', 'created_by', 'updated_by',
                  'quick_links', 'active', 'password', 'created_at', 'updated_at']
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


class LogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Log
        fields = ['id', 'action', 'actioned_by', 'actioned_at']
        extra_kwargs = {
            'action': {'required': True},
            'actioned_by': {'required': True},
        }


class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ['id', 'permission', 'is_boolean',
                  'allowed_values', 'created_at', 'created_by']
        extra_kwargs = {
            'permission': {'required': True},
            'is_boolean': {'required': True},
        }


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['id', 'role', 'created_at', 'created_by']
        extra_kwargs = {
            'role': {'required': True},
        }


class RolePermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = RolePermission
        fields = ['id', 'role', 'permission',
                  'value', 'created_at', 'created_by']
        extra_kwargs = {
            'role': {'required': True},
            'permission': {'required': True},
            'value': {'required': True},
        }


class AdminRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminRole
        fields = ['id', 'admin', 'role', 'created_at', 'created_by']
        extra_kwargs = {
            'admin': {'required': True},
            'role': {'required': True},
        }


class AdminPermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminPermission
        fields = ['id', 'admin', 'permission',
                  'value', 'created_at', 'created_by']
        extra_kwargs = {
            'admin': {'required': True},
            'permission': {'required': True},
            'value': {'required': True},
        }
