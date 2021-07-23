from django.db import models
from django.conf import settings
from datetime import datetime
from django.core.validators import MaxValueValidator, MinValueValidator

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
    description = models.TextField()
    profile_pic = models.ImageField(null=False, blank=False, default='default.jpg', upload_to=upload_path)
    tag_line = models.CharField(max_length=500, default="")

def upload_path_event(instance, filename):
    clb_name = Club_profile.objects.get(user=instance.user).title.replace(" ", "_")
    return "/".join(['events_imgs', clb_name , filename])

class Event(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,)
    event_title = models.CharField(max_length=250, unique=True)
    event_description = models.TextField()
    poster = models.ImageField(null=False, blank=False, default='default.jpg', upload_to=upload_path_event)
    date = models.DateTimeField()
    approved = models.IntegerField(default=0)
    visible = models.BooleanField(default=False)
    date_srt = models.DateTimeField(default=datetime.now, blank=True)
    completed = models.BooleanField(default=False)
    document1 = models.FileField(blank=True, null=True, default='default.jpg')
    document2 = models.FileField(blank=True, null=True, default='default.jpg')

class Member(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,)
    club_name = models.ForeignKey(Club_profile, on_delete=models.CASCADE)

class Register_Event(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,)
    event_name = models.ForeignKey(Event, on_delete=models.CASCADE)
    mobile_no = models.CharField(max_length=10)
    roll_no = models.CharField(max_length=10)
    check_in = models.BooleanField(default=False)
    date_srt = models.DateTimeField(default=datetime.now, blank=True)

class event_view(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,)
    event_name = models.ForeignKey(Event, on_delete=models.CASCADE)
    count_views = models.IntegerField(default=0)

class Announcement(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,)
    event_name = models.ForeignKey(Event, on_delete=models.CASCADE,blank=True, null=True)
    to_announce = models.CharField(max_length=250, default="")
    title = models.CharField(max_length=150)
    ann_description = models.TextField()
    date_srt = models.DateTimeField(default=datetime.now, blank=True)
    link = models.CharField(max_length=1000, default="None")    

    
class Rating(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,)
    event_name = models.ForeignKey(Event, on_delete=models.CASCADE)
    rating = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(5)])