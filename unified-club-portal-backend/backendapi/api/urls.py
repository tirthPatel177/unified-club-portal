from django.contrib import admin
from django.urls import path
from django.conf.urls import include
from rest_framework import routers
from .views import UserViewSet, BookViewSet

router = routers.DefaultRouter()
router.register('books', BookViewSet)
# router.register('users', UserViewSet.as_view())

urlpatterns = [
    path('', include(router.urls)),
    path('users', UserViewSet.as_view({'get': 'list'})),
]
