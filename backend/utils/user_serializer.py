from django_axor_auth.users.serializers import UserSerializer as AxorUserSerializer
from rest_framework import serializers


class UserSerializer(serializers.BaseSerializer):
    """
    This shapes user serializer from Axor to then send to users via REST API.
    Therefore, we need to omit sensetive fields.
    """

    def to_representation(self, instance):
        """
        Convert the user object to a dictionary.
        """
        # Use AxorUserSerializer to serialize the user object
        serializer = AxorUserSerializer(instance)
        data = serializer.data

        # keep only first name, last name and id
        data = {
            'id': data['id'],
            'first_name': data['first_name'],
            'last_name': data['last_name'],
        }
        return data
