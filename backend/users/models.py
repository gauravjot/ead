from django.db import models
from admins.models import Admin


class User(models.Model):
    name = models.CharField(max_length=64)
    title = models.CharField(max_length=64, null=True, blank=True)
    email = models.EmailField(max_length=64, null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    is_admin = models.OneToOneField(
        Admin, on_delete=models.SET_NULL, null=True, blank=True, unique=True)
    created_at = models.DateTimeField()
    created_by = models.ForeignKey(
        Admin, related_name='user_created_by', on_delete=models.SET_NULL, blank=True, null=True)
    updated_at = models.DateTimeField()
    updated_by = models.ForeignKey(
        Admin, related_name='user_updated_by', on_delete=models.SET_NULL, blank=True, null=True)


class Note(models.Model):
    user = models.ForeignKey(
        User, related_name='note_user', on_delete=models.CASCADE)
    note = models.TextField()
    created_at = models.DateTimeField()
    created_by = models.ForeignKey(
        Admin, related_name='note_created_by', on_delete=models.SET_NULL, blank=True, null=True)
    updated_at = models.DateTimeField()
    updated_by = models.ForeignKey(
        Admin, related_name='note_updated_by', on_delete=models.SET_NULL, blank=True, null=True)
