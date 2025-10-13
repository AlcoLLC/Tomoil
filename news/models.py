from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError
from ckeditor_uploader.fields import RichTextUploadingField
from django.utils.text import slugify


class News(models.Model):
    title = models.CharField(max_length=100)
    header_text = models.TextField()
    description = RichTextUploadingField(blank=True, null=True) 
    image_one = models.ImageField(upload_to='news/images/')
    image_two = models.ImageField(
        upload_to='news/images/', blank=True, null=True)
    image_three = models.ImageField(
        upload_to='news/images/', blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    views_count = models.PositiveIntegerField(default=0)
    in_home = models.BooleanField(
        default=False, verbose_name="Show on Home Page")
    
    slug = models.SlugField(max_length=255, unique=True, blank=True, null=True,
                            help_text="Leave blank to auto-generate from the title.")
    
    meta_title = models.CharField(max_length=255, blank=True, null=True)
    meta_description = models.TextField(blank=True, null=True)
    meta_keywords = models.CharField(max_length=500, blank=True, null=True)

    def __str__(self):
        return self.title

    def clean(self):
        if bool(self.image_two) != bool(self.image_three):
            raise ValidationError(
                "Either provide both image_two and image_three, or leave both empty.")
    
    def save(self, *args, **kwargs):
        if not self.slug and self.title:
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1
            while News.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug

        if not self.meta_title and self.title:
            self.meta_title = self.title

        if not self.meta_description and self.header_text:
            self.meta_description = self.header_text[:160]

        super().save(*args, **kwargs)