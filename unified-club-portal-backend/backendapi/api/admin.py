from django.contrib import admin
from .models import Book, Type_of_User, Club_profile, Event

admin.site.register(Book)
admin.site.register(Type_of_User)
admin.site.register(Club_profile)
admin.site.register(Event)