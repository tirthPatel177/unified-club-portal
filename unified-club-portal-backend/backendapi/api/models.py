from django.db import models
from django.conf import settings

class Book(models.Model):
    title = models.TextField(max_length=320, blank=False, null=False)
    
    
class Type_of_User(models.Model):
    author = models.OneToOneField(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,)
    type_of_user = models.CharField(max_length=50)


def upload_path(instance, filename):
    return "/".join(['profile_imgs', filename])

class Club_profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,)
    title = models.CharField(max_length=150, unique=True)
    description = models.TextField(max_length=1000)
    profile_pic = models.ImageField(null=False, blank=False, default='default.jpg', upload_to=upload_path)
    tag_line = models.CharField(max_length=500, default="")

def upload_path_event(instance, filename):
    return "/".join(['events_imgs', filename])

class Event(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,)
    event_title = models.CharField(max_length=250, unique=True)
    event_description = models.TextField(max_length=1000)
    poster = models.ImageField(null=False, blank=False, default='default.jpg', upload_to=upload_path_event)
    date = models.DateTimeField()
    