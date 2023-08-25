from django.db import models

class Admin(models.Model):
    id = models.AutoField(primary_key=True)
    full_name = models.CharField(max_length=48)
    title = models.CharField(max_length=48)
    username = models.CharField(max_length=24)
    password = models.CharField(max_length=96)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()

    def __str__(self):
        return f"id:{self.pk}, {self.full_name}, {self.username}"

class Session(models.Model):
    token = models.CharField(max_length=128)
    admin = models.ForeignKey(Admin, on_delete=models.CASCADE)
    valid = models.BooleanField(default=True)
    created = models.DateTimeField()

    def __str__(self):
        return f"User: {self.user}, Session made: {self.created} by {self.ip}, Valid: {self.valid}"
