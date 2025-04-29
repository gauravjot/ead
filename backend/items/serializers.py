from rest_framework import serializers
from .models import Item, ItemType
from .objs.item_template import ItemTemplate
from .objs.item import ItemValue, Item


class ItemTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemType
        fields = ['id', 'name', 'description', 'templates', 'created_by', 'created_at', 'updated_by', 'updated_at']
        extra_kwargs = {
            'name': {'required': True},
            'description': {'required': True},
            'created_by': {'required': True},
            'created_at': {'required': True},
        }


class ItemSerializer(serializers.ModelSerializer):
    values = serializers.JSONField(read_only=True)

    class Meta:
        model = Item
        fields = ['id', 'item_type', 'name', 'templates_value', 'added_by', 'added_at', 'updated_by', 'updated_at']
        extra_kwargs = {
            'name': {'required': True},
            'templates_value': {'required': True},
            'item_type': {'required': True},
            'added_by': {'required': True},
            'added_at': {'required': True},
        }

    def read(self, templates: list[ItemTemplate]) -> list[ItemValue]:
        """
        Read the templates and return the values.
        """
        result = []
        templates_value: list[Item] = self.validated_data['templates_value']
        # match the templates_value with the provided list of templates
        for template in templates:
            for template_value in templates_value:
                if template.uuid == template_value.template:
                    item_value = ItemValue(template_value.value, template)
                    result.append(item_value)
                    continue
        return result
