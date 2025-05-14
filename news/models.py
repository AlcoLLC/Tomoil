from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError


class News(models.Model):
    title = models.CharField(max_length=100)
    header_text = models.TextField()
    description = models.TextField()
    image_one = models.ImageField(upload_to='news/images/')
    image_two = models.ImageField(
        upload_to='news/images/', blank=True, null=True)
    image_three = models.ImageField(
        upload_to='news/images/', blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    views_count = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.title

    def clean(self):
        if bool(self.image_two) != bool(self.image_three):
            raise ValidationError(
                "Either provide both image_two and image_three, or leave both empty.")
