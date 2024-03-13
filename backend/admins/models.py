from django.db import models


class Admin(models.Model):
    username = models.CharField(max_length=24, primary_key=True)
    password = models.CharField(max_length=96)
    active = models.BooleanField(default=True)
    quick_links = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    created_by = models.ForeignKey(
        'self', related_name="admin_created_by", on_delete=models.SET_NULL, blank=True, null=True)
    updated_by = models.ForeignKey(
        'self', related_name="admin_updated_by", on_delete=models.SET_NULL, blank=True, null=True)


class Session(models.Model):
    token = models.CharField(max_length=128)
    admin = models.ForeignKey(Admin, on_delete=models.CASCADE)
    valid = models.BooleanField(default=True)
    created_at = models.DateTimeField()


class Log(models.Model):
    admin = models.ForeignKey(
        Admin, related_name="log_admin", on_delete=models.CASCADE)
    action = models.TextField()
    actioned_by = models.ForeignKey(
        Admin, related_name="log_actioned_by", on_delete=models.SET_NULL, blank=True, null=True)
    actioned_at = models.DateTimeField()


class Role(models.Model):
    role = models.CharField(max_length=24)
    created_at = models.DateTimeField()
    created_by = models.ForeignKey(
        Admin, related_name="role_created_by", on_delete=models.SET_NULL, blank=True, null=True)
    updated_at = models.DateTimeField()
    updated_by = models.ForeignKey(
        Admin, related_name="role_updated_by", on_delete=models.SET_NULL, blank=True, null=True)


class Permission(models.Model):
    permission = models.CharField(max_length=24)
    allowed_values = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField()
    created_by = models.ForeignKey(
        Admin, related_name="permission_created_by", on_delete=models.SET_NULL, blank=True, null=True)
    updated_at = models.DateTimeField()
    updated_by = models.ForeignKey(
        Admin, related_name="permission_updated_by", on_delete=models.SET_NULL, blank=True, null=True)


class RolePermission(models.Model):
    role = models.ForeignKey(Role, on_delete=models.CASCADE)
    permission = models.ForeignKey(Permission, on_delete=models.CASCADE)
    value = models.CharField(max_length=24)
    created_at = models.DateTimeField()
    created_by = models.ForeignKey(
        Admin, related_name="rolepermission_created_by", on_delete=models.SET_NULL, blank=True, null=True)
    updated_at = models.DateTimeField()
    updated_by = models.ForeignKey(
        Admin, related_name="rolepermission_updated_by", on_delete=models.SET_NULL, blank=True, null=True)


class AdminRole(models.Model):
    admin = models.ForeignKey(
        Admin, related_name="adminrole_given_to", on_delete=models.CASCADE)
    role = models.ForeignKey(Role, on_delete=models.CASCADE)
    created_at = models.DateTimeField()
    created_by = models.ForeignKey(
        Admin, related_name="adminrole_given_by", on_delete=models.SET_NULL, blank=True, null=True)
    updated_at = models.DateTimeField()
    updated_by = models.ForeignKey(
        Admin, related_name="adminrole_updated_by", on_delete=models.SET_NULL, blank=True, null=True)


class AdminPermission(models.Model):
    admin = models.ForeignKey(
        Admin, related_name="adminpermission_given_to", on_delete=models.CASCADE)
    permission = models.ForeignKey(Permission, on_delete=models.CASCADE)
    value = models.CharField(max_length=24)
    created_at = models.DateTimeField()
    created_by = models.ForeignKey(
        Admin, related_name="adminpermission_given_by", on_delete=models.SET_NULL, blank=True, null=True)
    updated_at = models.DateTimeField()
    updated_by = models.ForeignKey(
        Admin, related_name="adminpermission_updated_by", on_delete=models.SET_NULL, blank=True, null=True)
