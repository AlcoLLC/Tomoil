from django.db import models
from django.utils import timezone


class Contact(models.Model):
    CONTACT_METHODS = [
        ('email', 'Email'),
        ('phone', 'Phone'),
        ('no_preference', 'No preference'),
    ]

    ENQUIRY_TYPES = [
        ('General request', 'General request'),
        ('Technical support', 'Technical support'),
        ('Product inquiry', 'Product inquiry'),
        ('Quotation', 'Quotation'),
        ('Distributorship', 'Distributorship'),
    ]

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    country_code = models.CharField(max_length=10)
    contact_number = models.CharField(max_length=20)
    email = models.EmailField()
    country = models.CharField(max_length=100)
    enquiry_type = models.CharField(max_length=100, choices=ENQUIRY_TYPES)
    preferred_contact_method = models.CharField(
        max_length=20, choices=CONTACT_METHODS)
    message = models.TextField(blank=True, null=True)
    consent = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.email}"
