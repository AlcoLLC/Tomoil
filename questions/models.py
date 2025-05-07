from django.db import models
from django.utils import timezone


class Question(models.Model):
    question = models.TextField()
    answer = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.question
