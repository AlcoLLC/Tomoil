from django.db import models
from django.utils import timezone


from django.utils.translation import gettext_lazy as _

class Contact(models.Model):
    
    CONTACT_METHODS = [
        ('email', _('Email')),
        ('phone', _('Phone')),
        ('no_preference', _('No preference')),
    ]

    ENQUIRY_TYPES = [
        ('General request', _('General request')),
        ('Technical support', _('Technical support')),
        ('Product inquiry', _('Product inquiry')),
        ('Quotation', _('Quotation')),
        ('Distributorship', _('Distributorship')),
    ]

    first_name = models.CharField(max_length=100, verbose_name=_('First Name'))
    last_name = models.CharField(max_length=100, verbose_name=_('Last Name'))
    country_code = models.CharField(max_length=10, verbose_name=_('Country Code'))
    contact_number = models.CharField(max_length=20, verbose_name=_('Contact Number'))
    email = models.EmailField(verbose_name=_('Email'))
    country = models.CharField(max_length=100, verbose_name=_('Country'))
    enquiry_type = models.CharField(
        max_length=100, 
        choices=ENQUIRY_TYPES, 
        verbose_name=_('Enquiry Type')
    )
    preferred_contact_method = models.CharField(
        max_length=20, 
        choices=CONTACT_METHODS,
        verbose_name=_('Preferred Contact Method')
    )
    message = models.TextField(blank=True, null=True, verbose_name=_('Message'))
    consent = models.BooleanField(default=False, verbose_name=_('Consent'))
    
    # New fields for reCAPTCHA and IP tracking
    ip_address = models.GenericIPAddressField(
        verbose_name=_('IP Address'), 
        null=True, 
        blank=True
    )
    recaptcha_verified = models.BooleanField(
        default=False, 
        verbose_name=_('reCAPTCHA Verified')
    )
    
    created_at = models.DateTimeField(default=timezone.now, verbose_name=_('Created At'))

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.email}"

    class Meta:
        verbose_name = _('Contact')
        verbose_name_plural = _('Contacts')
        indexes = [
            models.Index(fields=['ip_address']),
            models.Index(fields=['created_at']),
        ]

        
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

class CarLogo(models.Model):
    image = models.ImageField(
        upload_to='car_logos/',
        help_text="Image of the car logo"
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Whether this car logo is active and should be displayed"
    )
    order = models.PositiveIntegerField(
        default=0,
        help_text="Order of the car logo in the display"
    )
    
    def __str__(self):
        return f"Car Logo - {'Active' if self.is_active else 'Inactive'}"

    class Meta:
        verbose_name = "Car Logo"
        verbose_name_plural = "Car Logos"

class PartnerLogo(models.Model):
    image = models.ImageField(
        upload_to='partner_logos/',
        help_text="Image of the partner's logo"
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Whether this partner's logo is active and should be displayed"
    )
    order = models.PositiveIntegerField(
        default=0,
        help_text="Order of the partner's logo in the display"
    )
    
    def __str__(self):
        return f"Partner Logo - {'Active' if self.is_active else 'Inactive'}"

    class Meta:
        verbose_name = "Partner Logo"
        verbose_name_plural = "Partner Logos"

class TomoilReview(models.Model):
    name = models.CharField(
        max_length=100,
        help_text="Name of the person giving the review"
    )
    position = models.CharField(
        max_length=100,
        help_text="Position of the person giving the review"
    )
    image = models.ImageField(
        upload_to='tomoil_reviews/',
        help_text="Image of the person giving the review"
    )
    review = models.TextField(
        help_text="Review text"
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Whether this review is active and should be displayed"
    )
    created_at = models.DateTimeField(
        default=timezone.now,
        help_text="Date and time when the review was created"
    )

    def __str__(self):
        return f"{self.name}"
    
class Footer(models.Model):
    email = models.EmailField(
        blank=True,
        null=True,
        help_text="Email address for the footer"
    )

    def __str__(self):
        return f"Footer"

    class Meta:
        verbose_name = "Footer"
        verbose_name_plural = "Footers"