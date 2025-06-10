from django.db import models


class Glance(models.Model):
    title = models.CharField(max_length=255)
    header_text = models.TextField()
    image = models.ImageField(upload_to="glance/images/")
    description_header_text = models.CharField(max_length=255)
    description = models.TextField()

    def __str__(self):
        return self.title


class GlanceGuide(models.Model):
    glance = models.ForeignKey(Glance, related_name='guides', on_delete=models.CASCADE)
    guide = models.CharField(max_length=255)
    guide_text = models.TextField()

    def __str__(self):
        return f"{self.guide} - {self.glance.title}"



class VisionMission(models.Model):
    vision = models.TextField()
    mission = models.TextField()

    def __str__(self):
        return self.vision


class Value(models.Model):
    vision_mission = models.ForeignKey(
        VisionMission,
        related_name='values',
        on_delete=models.CASCADE
    )
    title = models.CharField(max_length=255)
    description = models.TextField()

    def __str__(self):
        return self.title


class OurCommitment(models.Model):
    tab_title = models.CharField(max_length=255)
    title = models.CharField(max_length=255)
    header_description = models.TextField()
    image = models.ImageField(
        upload_to='ourcommitments/images/', blank=True, null=True)
    description_title = models.CharField(max_length=255)
    description = models.TextField()

    def __str__(self):
        return self.title
