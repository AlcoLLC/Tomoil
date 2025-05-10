from django.db import models
from django_ckeditor_5.fields import CKEditor5Field


class Glance(models.Model):
    title = models.CharField(max_length=255)
    header_text = models.TextField()
    guide = models.CharField(max_length=255)
    guide_text = models.TextField()
    image = models.ImageField(upload_to="glance/images/")
    description_header_text = models.CharField(max_length=255)
    description = CKEditor5Field()

    def __str__(self):
        return self.title


class VisionMission(models.Model):
    vision = models.TextField()
    mission = models.TextField()
    value_title = models.CharField(max_length=255)
    value_description = models.TextField()

    def __str__(self):
        return self.vision


class OurCommitment(models.Model):
    tab_title = models.CharField(max_length=255)
    title = models.CharField(max_length=255)
    header_description = CKEditor5Field()
    image = models.ImageField(
        upload_to='ourcommitments/images/', blank=True, null=True)
    description_title = models.CharField(max_length=255)
    description = models.TextField()

    def __str__(self):
        return self.title
