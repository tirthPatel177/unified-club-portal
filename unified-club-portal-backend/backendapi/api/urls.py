from django.contrib import admin
from django.urls import path
from django.conf.urls import include
from rest_framework import routers
from .views import (
    UserViewSet, 
    UserViewSet_club, 
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
    club_profile,
    Event_register,
    Event_unregister,
    Registered_users,
    event_update,
    event_data_id,
    Is_registered,
    get_type_user,
    announcement,
    get_announcements,
    uncompleted_events,
    get_announcement_club,
    rating,
    )

router = routers.DefaultRouter()
router.register('books', BookViewSet)
# router.register('users', UserViewSet.as_view())

urlpatterns = [
    path('', include(router.urls)),
    # url(r'^api/api-token-auth/', obtain_auth_token),
    path('users', UserViewSet.as_view({'get': 'list'})),
    path('clubs', UserViewSet_club.as_view({'get': 'list'})),
    path('login', ObtainAuthToken.as_view()),
    path('user/get_info', get_data_user.as_view()),
    path('user/get_type_user', get_type_user.as_view()),
    path('user/activate/<uidb64>/<token>', VerificationView.as_view(), name='activate'),
    path('club/profile_club_create', club_data_create.as_view()),
    path('club/event_create', event_create.as_view()),
    path('club/event_update', event_update.as_view()),
    path('club/clubs_all', clubs_all.as_view()),
    path('club/event_data_id', event_data_id.as_view()),
    path('club/profile_club/<club_name>', club_data.as_view()),
    path('club/club_profile', club_profile.as_view()),
    path('club/events/<club_name>', events_club.as_view()),
    path('club/uncompleted_events/<club_name>', uncompleted_events.as_view()),
    path('club/events_all', events_all.as_view()),
    path('club/member_add', member_add.as_view()),
    path('club/member_delete', member_delete.as_view()),
    path('club/event_register', Event_register.as_view()),
    path('club/event_unregister', Event_unregister.as_view()),
    path('club/is_registered', Is_registered.as_view()),
    path('club/registered_users/<event_name>', Registered_users.as_view()),
    path('club/announcement', announcement.as_view()),
    path('club/get_announcements', get_announcements.as_view()),
    path('club/get_announcement_club/<club_name>', get_announcement_club.as_view()),
    path('user/rating', rating.as_view()),
]