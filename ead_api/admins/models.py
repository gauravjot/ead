from django.db import models


class Admin(models.Model):
    full_name = models.CharField(max_length=48)
    title = models.CharField(max_length=48)
    username = models.CharField(max_length=24, primary_key=True)
    password = models.CharField(max_length=96)
    active = models.BooleanField(default=True)
    quick_links = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    created_by = models.CharField(max_length=24)
    updated_by = models.CharField(max_length=24)


class Session(models.Model):
    token = models.CharField(max_length=128)
    admin = models.ForeignKey(Admin, on_delete=models.CASCADE)
    valid = models.BooleanField(default=True)
    created_at = models.DateTimeField()
