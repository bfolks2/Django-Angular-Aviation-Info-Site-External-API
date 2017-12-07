from django.db import models

# Create your models here.

class Airport(models.Model):
    name = models.CharField(max_length=256)
    icao = models.CharField(max_length=4, unique=True, default=None)

    def upper_abbrev(self):
        return self.icao.upper()

    def __str__(self):
        return self.name
