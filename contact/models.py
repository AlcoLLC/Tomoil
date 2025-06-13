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

class HomeSwiper(models.Model):    
    image = models.ImageField(
        upload_to='home_swiper/',
        help_text="Image to be displayed in the home page swiper"
    )
    order = models.PositiveIntegerField(
        default=0,
        help_text="Order of the image in the swiper"
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Whether this image is active and should be displayed"
    )
    title = models.CharField(
        max_length=200,
        help_text="Title for the swiper image"
    )
    description = models.TextField(
        blank=True,
        null=True,
        help_text="Description for the swiper image"
    )
    title_description = models.TextField(
        blank=True,
        null=True,
        help_text="Additional description for the swiper image"
    )
    link = models.URLField(
        blank=True,
        null=True,
        help_text="Link to navigate when the swiper image is clicked"
    )

    def __str__(self):
        return f"Swiper Image {self.order} - {'Active' if self.is_active else 'Inactive'}"

    class Meta:
        ordering = ['order']
        verbose_name = "Home Swiper Image"
        verbose_name_plural = "Home Swiper Images"