from django.contrib import admin
from .models import Book, Type_of_User, Club_profile, Event, Member, Register_Event

admin.site.register(Book)
admin.site.register(Type_of_User)
admin.site.register(Club_profile)
admin.site.register(Event)
admin.site.register(Member)
admin.site.register(Register_Event)