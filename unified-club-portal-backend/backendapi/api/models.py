from django.db import models
from django.conf import settings

class Book(models.Model):
    title = models.TextField(max_length=320, blank=False, null=False)
    
    
class Type_of_User(models.Model):
    author = models.OneToOneField(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,)
    type_of_user = models.CharField(max_length=50)


class Club_profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,)
    title = models.CharField(max_length=150)
    description = models.TextField(max_length=1000)
    profile_pic = models.ImageField(null=False, blank=False, default='default.jpg')