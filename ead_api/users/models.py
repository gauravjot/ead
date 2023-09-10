from django.db import models
from admins.models import Admin


class User(models.Model):
    id = models.UUIDField(primary_key=True)
    name = models.CharField(max_length=48)
    title = models.CharField(max_length=48)
    email = models.EmailField(max_length=64, null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    created_at = models.DateTimeField()
    created_by = models.ForeignKey(
        Admin, related_name='created_by', on_delete=models.SET_NULL, blank=True, null=True)
    updated_at = models.DateTimeField()
    updated_by = models.ForeignKey(
        Admin, related_name='updated_by', on_delete=models.SET_NULL, blank=True, null=True)
