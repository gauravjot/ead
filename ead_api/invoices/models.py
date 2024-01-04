from django.db import models
from admins.models import Admin


class Client(models.Model):
    id = models.UUIDField(primary_key=True)
    name = models.CharField(max_length=64)
    type = models.CharField(max_length=48)
    street = models.CharField(max_length=128, null=True, blank=True)
    city = models.CharField(max_length=128, null=True, blank=True)
    province = models.CharField(max_length=128, null=True, blank=True)
    postal_code = models.CharField(max_length=16, null=True, blank=True)
    country = models.CharField(max_length=128, null=True, blank=True)
    email = models.EmailField(max_length=64, null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    vat = models.CharField(max_length=16, null=True, blank=True)
    notes = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField()
    created_by = models.ForeignKey(
        Admin, related_name='client_created_by', on_delete=models.SET_NULL, blank=True, null=True)
    updated_at = models.DateTimeField()
    updated_by = models.ForeignKey(
        Admin, related_name='client_updated_by', on_delete=models.SET_NULL, blank=True, null=True)


class Company(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=64)
    street = models.CharField(max_length=128, null=True, blank=True)
    city = models.CharField(max_length=128, null=True, blank=True)
    province = models.CharField(max_length=128, null=True, blank=True)
    postal_code = models.CharField(max_length=16, null=True, blank=True)
    country = models.CharField(max_length=128, null=True, blank=True)
    email = models.EmailField(max_length=64, null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    vat = models.CharField(max_length=16, null=True, blank=True)
    notes = models.TextField()
    created_at = models.DateTimeField()
    created_by = models.ForeignKey(
        Admin, related_name='invoicefrom_created_by', on_delete=models.SET_NULL, blank=True, null=True)
    updated_at = models.DateTimeField()
    updated_by = models.ForeignKey(
        Admin, related_name='invoicefrom_updated_by', on_delete=models.SET_NULL, blank=True, null=True)


class Invoice(models.Model):
    id = models.AutoField(primary_key=True)
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    invoice_number = models.CharField(max_length=32)
    po_number = models.CharField(max_length=32)
    date_due = models.DateTimeField()
    date_sent = models.DateTimeField()
    notes = models.TextField()
    terms = models.TextField()
    subtotal = models.FloatField()
    tax_exempt = models.BooleanField()
    tax_percent = models.FloatField()
    discount_amount = models.FloatField()
    shipping_amount = models.FloatField()
    total = models.FloatField()
    prepaid = models.FloatField()
    amount_due = models.FloatField()
    created_at = models.DateTimeField()
    created_by = models.ForeignKey(
        Admin, related_name='invoice_created_by', on_delete=models.SET_NULL, blank=True, null=True)
    updated_at = models.DateTimeField()
    updated_by = models.ForeignKey(
        Admin, related_name='invoice_updated_by', on_delete=models.SET_NULL, blank=True, null=True)


class Product(models.Model):
    id = models.AutoField(primary_key=True)
    item_type = models.CharField(max_length=48)
    item_name = models.CharField(max_length=48)
    item_quantity = models.IntegerField()
    item_price = models.FloatField()
    item_subtotal = models.FloatField()
    created_at = models.DateTimeField()
    created_by = models.ForeignKey(
        Admin, related_name='invoiceitem_created_by', on_delete=models.SET_NULL, blank=True, null=True)
    updated_at = models.DateTimeField()
    updated_by = models.ForeignKey(
        Admin, related_name='invoiceitem_updated_by', on_delete=models.SET_NULL, blank=True, null=True)


class InvoiceProduct(models.Model):
    id = models.AutoField(primary_key=True)
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    acting_price = models.FloatField()
    created_at = models.DateTimeField()
    created_by = models.ForeignKey(
        Admin, related_name='invoiceproduct_created_by', on_delete=models.SET_NULL, blank=True, null=True)
    updated_at = models.DateTimeField()
    updated_by = models.ForeignKey(
        Admin, related_name='invoiceproduct_updated_by', on_delete=models.SET_NULL, blank=True, null=True)
