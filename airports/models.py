from django.db import models

# Create your models here.

class Airport(models.Model):
    name = models.CharField(max_length=256)
    abbrev = models.CharField(max_length=4)

    def upper_abbrev(self):
        return self.abbrev.upper()
