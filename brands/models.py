from django.db import models
from PIL import Image
from io import BytesIO
from django.core.files.base import ContentFile


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