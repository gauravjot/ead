from django.db import models
from admins.models import Admin


class ItemType(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=48)
    description = models.TextField()
    template = models.JSONField(null=True, blank=True)
    created_by = models.ForeignKey(
        Admin, on_delete=models.SET_NULL, null=True, blank=True, related_name='itemtype_created_by')
    created_at = models.DateTimeField()
    updated_by = models.ForeignKey(
        Admin, on_delete=models.SET_NULL, null=True, blank=True, related_name='itemtype_updated_by')
    updated_at = models.DateTimeField()
    mark_deleted = models.BooleanField(default=False)
    deleted_by = models.ForeignKey(
        Admin, on_delete=models.SET_NULL, null=True, blank=True, related_name='itemtype_deleted_by', default=None)
    deleted_at = models.DateTimeField(null=True, default=None)


class Item(models.Model):
    id = models.AutoField(primary_key=True)
    item_type = models.ForeignKey(ItemType, on_delete=models.CASCADE)
    name = models.CharField(max_length=48)
    value = models.JSONField()
    added_by = models.ForeignKey(
        Admin, on_delete=models.SET_NULL, null=True, blank=True, related_name='item_added_by')
    added_at = models.DateTimeField()
    updated_by = models.ForeignKey(
        Admin, on_delete=models.SET_NULL, null=True, blank=True, related_name='item_updated_by')
    updated_at = models.DateTimeField()
    mark_deleted = models.BooleanField(default=False)
    deleted_by = models.ForeignKey(
        Admin, on_delete=models.SET_NULL, null=True, blank=True, related_name='item_deleted_by', default=None)
    deleted_at = models.DateTimeField(null=True, default=None)
