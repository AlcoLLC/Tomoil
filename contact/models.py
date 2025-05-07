from django.db import models


class Contact(models.Model):
    CONTACT_METHODS = [
        ('email', 'Email'),
        ('phone', 'Phone'),
        ('no_preference', 'No preference'),
    ]

    full_name = models.CharField(max_length=100)
    contact_number = models.CharField(max_length=20)
    email = models.EmailField()
    country = models.CharField(max_length=100)
    enquiry_type = models.CharField(max_length=100)
    preferred_contact_method = models.CharField(
        max_length=20, choices=CONTACT_METHODS)
    message = models.TextField()
    consent = models.BooleanField()

    def __str__(self):
        return f"{self.full_name} - {self.email}"
