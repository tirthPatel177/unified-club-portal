from django.contrib import admin
from django.urls import path
from django.conf.urls import include
from rest_framework import routers
from .views import (
    UserViewSet, 
    BookViewSet, 
    ObtainAuthToken, 
    get_data_user, 
    VerificationView, 
    club_data, 
    club_data_create, 
    clubs_all, 
    event_create, 
    events_all,
    events_club,
    member_add,
    member_delete,
    )

router = routers.DefaultRouter()
router.register('books', BookViewSet)
# router.register('users', UserViewSet.as_view())

urlpatterns = [
    path('', include(router.urls)),
    # url(r'^api/api-token-auth/', obtain_auth_token),
    path('users', UserViewSet.as_view({'get': 'list'})),
    path('login', ObtainAuthToken.as_view()),
    path('get_info', get_data_user.as_view()),
    path('activate/<uidb64>/<token>', VerificationView.as_view(), name='activate'),
    path('profile_club_create', club_data_create.as_view()),
    path('event_create', event_create.as_view()),
    path('clubs_all', clubs_all.as_view()),
    path('profile_club/<club_name>', club_data.as_view()),
    path('events/<club_name>', events_club.as_view()),
    path('events_all', events_all.as_view()),
    path('member_add', member_add.as_view()),
    path('member_delete', member_delete.as_view()),
]