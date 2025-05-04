from django.db import models
from django_axor_auth.users.models import User


class ItemType(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=48)
    description = models.TextField()
    templates = models.JSONField(null=True, blank=True)  # Hold list of multiple templates for this item type
    created_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name='itemtype_created_by')
    created_at = models.DateTimeField()
    updated_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name='itemtype_updated_by')
    updated_at = models.DateTimeField(null=True)


class Item(models.Model):
    id = models.AutoField(primary_key=True)
    item_type = models.ForeignKey(ItemType, on_delete=models.CASCADE)
    name = models.CharField(max_length=48)
    templates_value = models.JSONField()  # Hold list of multiple templates values for this item
    created_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name='item_added_by')
    created_at = models.DateTimeField()
    updated_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name='item_updated_by')
    updated_at = models.DateTimeField(null=True)
