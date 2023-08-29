from django.db import models
from admins.models import Admin

class User(models.Model):
    id = models.UUIDField(primary_key=True)
    name = models.CharField(max_length=48)
    title = models.CharField(max_length=48)
    email = models.EmailField(max_length=64)
    phone = models.CharField(max_length=20)
    created_at = models.DateTimeField()
    created_by = models.ForeignKey(Admin, on_delete=models.SET_NULL, blank=True, null=True)
    updated_at = models.DateTimeField()
       
