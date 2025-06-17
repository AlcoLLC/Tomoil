from django.db import models
from PIL import Image
from django.core.exceptions import ValidationError


class BrandPromotionalItem(models.Model):
    title = models.CharField(
        max_length=255, help_text="File name or promotion title")
    preview_image = models.ImageField(
        upload_to='brand_promotional_items/previews/', help_text="Visual preview")
    width = models.IntegerField(
        help_text="Preview image width (px)", editable=False, null=True, blank=True)
    height = models.IntegerField(
        help_text="Preview image height (px)", editable=False, null=True, blank=True)
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        
        if self.preview_image:
            img = Image.open(self.preview_image.path)
            self.width, self.height = img.size
            
            max_size = (500, 500)
            if img.width > 500 or img.height > 500:
                img.thumbnail(max_size, Image.LANCZOS)
                img.save(self.preview_image.path)
                
                self.width, self.height = img.size
            
            super().save(update_fields=["width", "height"])
    
    def __str__(self):
        return self.title


class BrandImageLibrary(models.Model):
    IMAGE_TYPES = [
        ('corporate', 'Corporate'),
        ('dealership', 'Dealership and Formulas'),
        ('sponsorship', 'Sponsorship'),
    ]
    
    title = models.CharField(
        max_length=255, help_text="File name or image title")
    preview_image = models.ImageField(
        upload_to='brand_image_library/previews/', help_text="Visual preview")
    width = models.IntegerField(
        help_text="Preview image width (px)", editable=False, null=True, blank=True)
    height = models.IntegerField(
        help_text="Preview image height (px)", editable=False, null=True, blank=True)
    type = models.CharField(
        max_length=20,
        choices=IMAGE_TYPES,
        default='corporate',
        help_text="Image category/type"
    )
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        
        if self.preview_image:
            img = Image.open(self.preview_image.path)
            self.width, self.height = img.size
            
            max_size = (500, 500)
            if img.width > 500 or img.height > 500:
                img.thumbnail(max_size, Image.LANCZOS) 
                img.save(self.preview_image.path)
                
                self.width, self.height = img.size
            
            super().save(update_fields=["width", "height"])
    
    def __str__(self):
        return self.title


class BrandVideo(models.Model):
    title = models.CharField(max_length=200)
    video_url = models.URLField()
    thumbnail = models.ImageField(upload_to='brand_videos/thumbnails/', blank=True, null=True)
    
    def __str__(self):
        return self.title


class BrandGuidelineDocument(models.Model):
    title = models.CharField(max_length=255)
    document = models.FileField(upload_to='brand_guidelines/documents/')
    description = models.TextField(blank=True, null=True)
    file_type = models.CharField(max_length=10, blank=True, null=True) 
    
    def __str__(self):
        return self.title


class BrandCatalogue(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    document = models.FileField(upload_to='brand_catalogues/')
    preview_image = models.ImageField(upload_to='brand_catalogues/previews/')
    
    def __str__(self):
        return self.title
    
class TomoilLogoFullColor(models.Model):
    logo = models.ImageField(
        upload_to='brand_logos/full_color/',
        help_text="Full color Tomoil logo"
    )
    title = models.CharField(
        max_length=255,
        help_text="Title for the logo"
    )
    description = models.TextField(
        help_text="Description for the logo"
    )
    logo_pdf = models.FileField(
        upload_to='brand_logos/full_color/pdf/',
        help_text="PDF version of the logo"
    )
    
    def clean(self):
        if not self.pk and TomoilLogoFullColor.objects.count() >= 2:
            raise ValidationError('Maximum 2 Full Color Tomoil logos allowed.')
    
    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"Tomoil Logo Full Color - {self.title}"

    class Meta:
        verbose_name = "Tomoil Full Color Logo"
        verbose_name_plural = "Tomoil Full Color Logos (Max: 2)"

class TomoilLogo(models.Model):
    logo = models.ImageField(
        upload_to='brand_logos/mono/',
        help_text="Monochrome Tomoil logo"
    )
    description = models.TextField(
        help_text="Description for the logo"
    )
    
    def clean(self):
        if not self.pk and TomoilLogo.objects.count() >= 4:
            raise ValidationError('Maximum 4 Monochrome Tomoil logos allowed.')
    
    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"Tomoil Logo Monochrome - {self.description[:50]}"

    class Meta:
        verbose_name = "Tomoil Monochrome Logo"
        verbose_name_plural = "Tomoil Monochrome Logos (Max: 4)"

class TomoilGuideline(models.Model):
    title = models.CharField(
        max_length=255,
        help_text="Title for the guideline document"
    )
    description = models.TextField(
        blank=True,
        null=True,
        help_text="Description for the guideline document"
    )
    logo_title = models.CharField(
        max_length=255,
        help_text="Title for the Tomoil logo"
    )
    logo_description = models.TextField(
        help_text="Description for the Tomoil logo"
    )
    logo_pdf = models.FileField(
        upload_to='brand_logos/tomoil/pdf/',
        help_text="PDF version of the Tomoil logo"
    )
    logo_png = models.ImageField(
        upload_to='brand_logos/tomoil/png/',
        help_text="PNG version of the Tomoil logo"
    )
    
    def clean(self):
        if not self.pk and TomoilGuideline.objects.count() >= 1:
            raise ValidationError('Only 1 Tomoil Guideline is allowed.')
    
    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"Tomoil Guideline - {self.title}"

    class Meta:
        verbose_name = "Tomoil Guideline"
        verbose_name_plural = "Tomoil Guidelines (Max: 1)"

class TomoilBrandingCards(models.Model):
    image = models.ImageField(
        upload_to='brand_logos/tomoil/branding/',
        help_text="Image for the branding card"
    )
    description = models.TextField(
        blank=True,
        null=True,
        help_text="Description for the branding document"
    )
    
    def clean(self):
        if not self.pk and TomoilBrandingCards.objects.count() >= 4:
            raise ValidationError('Maximum 4 Tomoil Branding Cards allowed.')
    
    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"Tomoil Branding Card - {self.description[:50] if self.description else 'No description'}"

    class Meta:
        verbose_name = "Tomoil Branding Card"
        verbose_name_plural = "Tomoil Branding Cards (Max: 4)"