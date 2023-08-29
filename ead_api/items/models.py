from django.db import models
from admins.models import Admin
from users.models import User

class Item(models.Model):
    id = models.AutoField(primary_key=True)
    item_type = models.ForeignKey(ItemType, on_delete = models.CASCADE)
    name = models.CharField(max_length=48)
    description = models.TextField()
    value = models.JSONField()
    active = models.BooleanField(default=True)

class Allocation(models.Model):
    id = models.BigAutoField(primary_key=True)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    notes = models.TextField()
    assigned_at = models.DateTimeField()
    assigned_by =  models.ForeignKey(Admin, on_delete=models.SET_NULL, null=True, blank=True)
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    returned_at = models.DateTimeField()
    collected_by = models.ForeignKey(Admin, on_delete=models.SET_NULL, null=True, blank=True)

class ItemType(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=24)
    description = models.TextField()   
    template = models.JSONField()
    created_by = models.ForeignKey(Admin, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField()
