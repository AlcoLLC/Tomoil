from django.db import models


class LubelQ(models.Model):
    title = models.CharField(max_length=255)
    header_text = models.TextField()
    testing_instruments = models.IntegerField()
    test_parameters = models.IntegerField()
    accuracy_rate = models.IntegerField()
    description_header_text = models.CharField(max_length=255)
    description = models.TextField()

    def __str__(self):
        return self.title


class Services(models.Model):
    tab_title = models.CharField(max_length=255)
    title = models.CharField(max_length=255)
    description = models.TextField()

    def __str__(self):
        return self.title
