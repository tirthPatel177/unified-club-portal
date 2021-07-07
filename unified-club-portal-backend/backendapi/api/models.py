from django.db import models

class Book(models.Model):
    title = models.TextField(max_length=320, blank=False, null=False)
    