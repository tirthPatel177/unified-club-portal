from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from .serializers import UserSerializer, BookSerializer, AuthCustomTokenSerializer, Club_profileSerializer, EventSerializer, MemberSerializer, Register_EventSerializer, AnnouncementSerializer
from rest_framework.response import Response
from .models import Book, Type_of_User, Club_profile, Event, Member, Register_Event, Announcement
from rest_framework import status
from django.contrib import auth
from rest_framework.generics import GenericAPIView
from rest_framework.views import APIView, View
from rest_framework import parsers
from rest_framework import renderers
from rest_framework.authtoken.models import Token
from django.core.exceptions import ValidationError, ObjectDoesNotExist
from django.core.mail import EmailMessage
from django.utils.encoding import force_bytes, force_text, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from .utils import token_generator
from django.db import IntegrityError
from datetime import datetime

class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        # print("--->>>",serializer)
        if serializer.is_valid():
            serializer.save()
            user = User.objects.get(email = serializer.data["email"])
            Type_of_User.objects.create(author=user, type_of_user=request.data["type_of_user"])
            
            user.is_active = False
            user.save()
            token, created = Token.objects.get_or_create(user=user)
            
            uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
            domain = get_current_site(request).domain
            link = reverse('activate', kwargs={'uidb64':uidb64,'token':token.key})
            
            activate_url="http://"+domain+link
            email_subject = "Activate Your Account"
            email_body = "Hii "+user.first_name+" "+user.last_name+" , please use the below link for activating your account\n" + activate_url
            email_send = EmailMessage(
                email_subject,
                email_body,
                "Email",
                [user.email],
            )
            
            email_send.send(fail_silently=False)

            Club_profile.objects.update_or_create(user=user, defaults=dict(title=email, description="", tag_line = ""))
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class VerificationView(APIView):    
    def get(self, request, uidb64, token):
        data = {
            "Account Status": "Activated"
        }
        user = Token.objects.get(key=token).user
        
        user.is_active = True
        user.save()
        
        return Response(data)
    
class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    authentication_classes = [TokenAuthentication, ]
    permission_classes = [IsAuthenticated, ]


# Stackoverflow code
class ObtainAuthToken(APIView):
    throttle_classes = ()
    permission_classes = ()
    parser_classes = (
        parsers.FormParser,
        parsers.MultiPartParser,
        parsers.JSONParser,
    )

    renderer_classes = (renderers.JSONRenderer,)

    def post(self, request):
        try:
            serializer = AuthCustomTokenSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.validated_data['user']
            token, created = Token.objects.get_or_create(user=user)

            content = {
                'token': token.key,
            }

            return Response(content)
        except ValidationError as e:
            content = {
                "Credential": e
            }
            return Response(content)
        
class get_type_user(APIView):
    def post(self, request):
        token = request.data["token"]
        user = Token.objects.get(key=request.POST.get("token", "")).user
        type_user = Type_of_User.objects.get(author=user)
        return Response({"type_of_user":type_user.type_of_user})
        

class get_data_user(APIView):
    def post(self, request):
        try:
            user = Token.objects.get(key=request.POST.get("token", "")).user
            
            type_user = Type_of_User.objects.get(author=user)
            
            content = {
                "username":user.username,
                "email":user.email,
                "first_name":user.first_name,
                "last_name":user.last_name,
                "type_of_user":type_user.type_of_user,
            }
            return Response(content)
        except ObjectDoesNotExist:
            content = {
                "Exception" : "User not found"
            }
            return Response(content)
        
class club_data_create(APIView):
    def post(self, request):
        try:
            token = request.data["token"]
            title = request.data["title"]
            desc = request.data["description"]
            img = request.data["profile_image"]
            tag_line = request.data["tag_line"]
            
            user = Token.objects.get(key=token).user

            # print("------>",img, type(img))
            #  After hosting change the path to the hosting server 
            if(type(img)==str):
                if("http://127.0.0.1:8000/images" in img):
                    img = img[len("http://127.0.0.1:8000/images"):]
            
            Club_profile.objects.update_or_create(user=user, defaults=dict(title=title, description=desc, profile_pic = img, tag_line = tag_line))
            
            
            cont = {
                "status" : "Updated Successfully"
            }
            
            return Response(cont,status=status.HTTP_201_CREATED)
        except IntegrityError:
            resp = {
                'Error': 'Club with this name already exists!'
            }
            return Response(resp, status=status.HTTP_400_BAD_REQUEST)

class clubs_all(APIView):
    parser_classes = (parsers.MultiPartParser, parsers.FormParser)


    def get(self, request):

        clubs = Club_profile.objects.all()
        
        serializer = Club_profileSerializer(clubs, many=True)
        
        
        data = []
        
        for club in serializer.data:
            club_data = {
                "title" : club["title"],
                "description" : club["description"],
                "profile" : ("http://127.0.0.1:8000"+club["profile_pic"]),
                "tag_line" : club["tag_line"],
            }
            
            data.append(club_data)
        
        return Response(data)
        
        
class club_profile(APIView):
    parser_classes = (parsers.MultiPartParser, parsers.FormParser)

    def post(self, request):
        token = request.data["token"]
        user = Token.objects.get(key=token).user
        clb = Club_profile.objects.get(user=user)
        
        serializer = Club_profileSerializer(clb)
        
        cont = {
            "title" : serializer.data["title"],
            "description" : serializer.data["description"],
            "profile" : ("http://127.0.0.1:8000"+serializer.data["profile_pic"]),
            "tag_line" : serializer.data["tag_line"],
        }
        
        return Response(cont)


class club_data(APIView):
    parser_classes = (parsers.MultiPartParser, parsers.FormParser)

    def get(self, request, club_name):
        
        club_name = club_name.replace('-',' ')
        
        clb = Club_profile.objects.get(title=club_name)
        
        serializer = Club_profileSerializer(clb)
        
        cont = {
            "title" : serializer.data["title"],
            "description" : serializer.data["description"],
            "profile" : ("http://127.0.0.1:8000"+serializer.data["profile_pic"]),
            "tag_line" : serializer.data["tag_line"],
        }
        
        return Response(cont)
    
    
class event_create(APIView):
    def post(self, request):
        try:
            token = request.data["token"]
            event_title = request.data["event_title"]
            event_description = request.data["event_description"]
            poster = request.data["poster"]
            date = request.data["date"]
            approved = False
            visible = True
            if(request.data["visible"] == 'true'):
                visible = True
            else:
                visible = False

            user = Token.objects.get(key=token).user
            
            # Event.objects.update_or_create(user=user, defaults=dict(event_title=event_title, event_description=event_description, date = date[0], approved=False))
            Event.objects.create(user=user, event_title=event_title, event_description=event_description, poster = poster, date = date, approved=approved, visible=visible)
            
            cont = {
                "status" : "Event Created Successfully"
            }
            
            return Response(cont,status=status.HTTP_201_CREATED)
    
        except IntegrityError:
                resp = {
                    'Error': 'Event with this title already exists!'
                }
                return Response(resp, status=status.HTTP_400_BAD_REQUEST)

class event_update(APIView):
    def post(self, request):
        try:
            id_event = request.data["id_event"]
            token = request.data["token"]
            event_title = request.data["event_title"]
            event_description = request.data["event_description"]
            poster = request.data["poster"]
            date = request.data["date"]
            approved = False
            visible = True
            if(request.data["visible"].lower() == 'true'):
                visible = True
            else:
                visible = False

            user = Token.objects.get(key=token).user
            
            obj = Event.objects.get(id=id_event)
            
            obj.event_title = event_title
            obj.event_description = event_description
            if(type(poster)==str):
                if("http://127.0.0.1:8000/images" in poster):
                    poster = poster[len("http://127.0.0.1:8000/images"):]
            

            obj.poster = poster
            obj.date = date
            obj.visible = visible
            
            obj.save()        
            # # Event.objects.update_or_create(user=user, defaults=dict(event_title=event_title, event_description=event_description, date = date[0], approved=False))
            # Event.objects.create(user=user, event_title=event_title, event_description=event_description, poster = poster, date = date, approved=approved, visible=visible)
            
            cont = {
                "status" : "Event Updated Successfully"
            }
            
            return Response(cont,status=status.HTTP_201_CREATED)

        except IntegrityError:
            resp = {
                'Error': 'Event with this title already exists!'
            }
            return Response(resp, status=status.HTTP_400_BAD_REQUEST)

class events_all(APIView):
    parser_classes = (parsers.MultiPartParser, parsers.FormParser)


    def get(self, request):

        events = Event.objects.all()
        
        serializer = EventSerializer(events, many=True)
        
        
        data = []
        i = 0
        for event in serializer.data:
            club_prof = Club_profile.objects.get(user=events[i].user)
            Club_prof = Club_profileSerializer(club_prof)
            i+=1
            if(event["approved"]==1 and event["visible"]):
                if(event["poster"][0]!='/'):
                    event["poster"] = '/'+event["poster"]
                if(Club_prof.data["profile_pic"][0]!='/'):
                    Club_prof.data["profile_pic"] = '/'+Club_prof.data["profile_pic"]
                event_data = {
                    "id_event" : event["id"],
                    "event_title" : event["event_title"],
                    "event_description" : event["event_description"],
                    "poster" : ("http://127.0.0.1:8000"+event["poster"]),
                    "date" : event["date"],
                    "visible" : event["visible"],
                    "date_srt": datetime.strptime(event["date_srt"][0:19], '%Y-%m-%dT%H:%M:%S'),
                    "completed": event["completed"],
                    "club_name" : Club_prof.data["title"],
                    "profile_pic" : ("http://127.0.0.1:8000"+Club_prof.data["profile_pic"]),
                    
                }
                
                data.append(event_data)
        
        data.sort(key = lambda a:a["date_srt"], reverse=True)
        return Response(data)
    
    
class events_club(APIView):
    parser_classes = (parsers.MultiPartParser, parsers.FormParser)

    def get(self, request, club_name):
        
        club_name = club_name.replace('-',' ')
        
        user = Club_profile.objects.get(title=club_name).user
        
        events = Event.objects.filter(user=user)
        
        serializer = EventSerializer(events, many=True)

        data = []
        i=0
        for event in serializer.data:
            club_prof = Club_profile.objects.get(user=events[i].user)
            Club_prof = Club_profileSerializer(club_prof)
            i+=1
            if(event["approved"]==1 and event["visible"]):
                if(event["poster"][0]!='/'):
                    event["poster"] = '/'+event["poster"]
                if(Club_prof.data["profile_pic"][0]!='/'):
                    Club_prof.data["profile_pic"] = '/'+Club_prof.data["profile_pic"]
                event_data = {
                    "id_event" : event["id"],
                    "event_title" : event["event_title"],
                    "event_description" : event["event_description"],
                    "poster" : ("http://127.0.0.1:8000"+event["poster"]),
                    "date" : event["date"],
                    "visible" : event["visible"],
                    "date_srt": datetime.strptime(event["date_srt"][0:19], '%Y-%m-%dT%H:%M:%S'),
                    "completed": event["completed"],
                    "club_name" : Club_prof.data["title"],
                    "profile_pic" : ("http://127.0.0.1:8000"+Club_prof.data["profile_pic"]),
                    
                }
            
                data.append(event_data)    
        data.sort(key = lambda a:a["date_srt"], reverse=True)
        return Response(data)
    
class uncompleted_events(APIView):
    def get(self, request, club_name):
        
        club_name = club_name.replace('-',' ')
        user = Club_profile.objects.get(title=club_name).user
        events = Event.objects.filter(user=user)
        serializer = EventSerializer(events, many=True)
        data = []
        i=0
        for event in serializer.data:
            club_prof = Club_profile.objects.get(user=events[i].user)
            Club_prof = Club_profileSerializer(club_prof)
            i+=1
            if(event["completed"]==False):
                if club_name==Club_prof.data["title"]:
                    event_data = {
                        "id_event" : event["id"],
                        "event_title" : event["event_title"],
<<<<<<< HEAD
                        # "date_srt": datetime.strptime(event["date_srt"][], '%Y-%m-%dT%H:%M:%SZ'),
=======
                        "date_srt": datetime.strptime(event["date_srt"][0:19], '%Y-%m-%dT%H:%M:%S'),
>>>>>>> edee845df58b3abd43c7b0eeb0de3148b1ff5ab9
                    }
                
                    data.append(event_data)
        # data.sort(key = lambda a:a["date_srt"], reverse=True)
        return Response(data)

class event_data_id(APIView):
    parser_classes = (parsers.MultiPartParser, parsers.FormParser)
    def post(self, request):
        id_event = request.data["id_event"]
        
        evnt = Event.objects.get(id=id_event)
        
        club_prof = Club_profile.objects.get(user=evnt.user)
        Club_prof = Club_profileSerializer(club_prof)
        event = EventSerializer(evnt)
        # print(serializer.data["poster"])
        if(event.data["poster"][0]!='/'):
            event.data["poster"] = '/'+event.data["poster"]
        if(Club_prof.data["profile_pic"][0]!='/'):
            Club_prof.data["profile_pic"] = '/'+Club_prof.data["profile_pic"]
        event_data = {
            "id_event" : event.data["id"],
            "event_title" : event.data["event_title"],
            "event_description" : event.data["event_description"],
            "poster" : ("http://127.0.0.1:8000"+event.data["poster"]),
            "date" : event.data["date"],
            "visible" : event.data["visible"],
            "date_srt": datetime.strptime(event.data["date_srt"][0:19], '%Y-%m-%dT%H:%M:%S'),
            "completed": event.data["completed"],
            "club_name" : Club_prof.data["title"],
            "profile_pic" : ("http://127.0.0.1:8000"+Club_prof.data["profile_pic"]),
        }
        
        return Response(event_data)
    
class member_add(APIView):
    throttle_classes = ()
    permission_classes = ()
    parser_classes = (
        parsers.FormParser,
        parsers.MultiPartParser,
        parsers.JSONParser,
    )

    renderer_classes = (renderers.JSONRenderer,)
    
    def post(self, request):
        token = request.data["token"]
        title = request.data["title"]
        
        title = Club_profile.objects.get(title=title)
        user = Token.objects.get(key=token).user
        if(Member.objects.filter(user=user, club_name=title).exists()):
            det = {"Error": "You are already a member"}
            return Response(det, status=status.HTTP_400_BAD_REQUEST)
        else:
            Member.objects.create(user=user, club_name=title)
                
        det = {"success": "Added as Member successfully"}
        
        return Response(det, status=status.HTTP_201_CREATED)
        
    
    
class member_delete(APIView):
    throttle_classes = ()
    permission_classes = ()
    parser_classes = (
        parsers.FormParser,
        parsers.MultiPartParser,
        parsers.JSONParser,
    )

    renderer_classes = (renderers.JSONRenderer,)
    
    def post(self, request):
        token = request.data["token"]
        title = request.data["title"]
        title = Club_profile.objects.get(title=title)
        user = Token.objects.get(key=token).user
        Member.objects.get(user=user, club_name=title).delete()
        
        det = {"success": "Removed as Member successfully"}
        
        return Response(det, status=status.HTTP_201_CREATED)


class Event_register(APIView):
    throttle_classes = ()
    permission_classes = ()
    parser_classes = (
        parsers.FormParser,
        parsers.MultiPartParser,
        parsers.JSONParser,
    )
    renderer_classes = (renderers.JSONRenderer,)
    def post(self, request):
        token = request.data["token"]
        id_event = request.data["id_event"]
        mobile_no = request.data["mobile_no"]
        roll_no = request.data["roll_no"]

        user = Token.objects.get(key=token).user
        
        event_name = Event.objects.get(id=id_event)
        
        if(Register_Event.objects.filter(user=user, event_name=event_name).exists()):
            det = {"Error": "Already registered"}
            return Response(det, status=status.HTTP_400_BAD_REQUEST)
        else:
            Register_Event.objects.create(user=user, event_name=event_name, mobile_no=mobile_no, roll_no=roll_no)

        det = {"success":"Registered successfully"}
        return Response(det, status=status.HTTP_201_CREATED)
    
class Event_unregister(APIView):
    throttle_classes = ()
    permission_classes = ()
    parser_classes = (
        parsers.FormParser,
        parsers.MultiPartParser,
        parsers.JSONParser,
    )
    renderer_classes = (renderers.JSONRenderer,)
    def post(self, request):
        token = request.data["token"]
        id_event = request.data["id_event"]

        user = Token.objects.get(key=token).user
        
        event_name = Event.objects.get(id=id_event)
        
        Register_Event.objects.get(user=user, event_name=event_name).delete()

        det = {"success":"Unregistered successfully"}
        return Response(det, status=status.HTTP_201_CREATED)

class Registered_users(APIView):
    parser_classes = (parsers.MultiPartParser, parsers.FormParser)
    def get(self, request, event_name):
        event_name = event_name.replace('-', ' ')
        event_name = Event.objects.get(event_title=event_name)
        participants = Register_Event.objects.filter(event_name=event_name)
        participants = Register_EventSerializer(participants, many=True)
        data = []

        for participant in participants.data:
            part_data = {}
            user = User.objects.get(id=participant["user"])
            part_data["first_name"]=user.first_name
            part_data["last_name"]=user.last_name
            part_data["email"]=user.email
            part_data["mobile_no"]=participant["mobile_no"]
            part_data["roll_no"]=participant["roll_no"]
            part_data["date_srt"]=datetime.strptime(participant["date_srt"][0:19], '%Y-%m-%dT%H:%M:%S'),
            data.append(part_data)
        
        data.sort(key = lambda a:a["date_srt"], reverse=True)
        return Response(data)
    
class Is_registered(APIView):
    parser_classes = (parsers.MultiPartParser, parsers.FormParser)
    def post(self, request):
        token = request.data["token"]
        id_event = request.data["id_event"]
        
        user = Token.objects.get(key=token).user
        
        event_name = Event.objects.get(id=id_event)
        if(Register_Event.objects.filter(user=user, event_name=event_name).exists()):
            return Response({"user": "true"})
        return Response({"user":"false"})
    
class announcement(APIView):
    parser_classes = (parsers.MultiPartParser, parsers.FormParser)
    def post(self, request):
        token = request.data["token"]
        event_title = request.data["event_title"]
        to_announce = request.data["to_announce"]
        title = request.data["title"]
        ann_description = request.data["ann_description"]
        
        user = Token.objects.get(key=token).user
        event_name = Event.objects.get(event_title=event_title)
        Announcement.objects.create(user=user, event_name=event_name, to_announce=to_announce, title=title,ann_description=ann_description)
        
        return Response({"success":"Announcement created successfully"})
    
class get_announcements(APIView):
    parser_classes = (parsers.MultiPartParser, parsers.FormParser)
    def post(self, request):
        token = request.data["token"]
        club_nm = request.data["club_name"]
        user = Token.objects.get(key=token).user
        
        # members = Member.objects.filter(user=user)
        # data1 = []
        # for member in members:
        #     user1 = member.club_name.user
        #     evnts = Event.objects.filter(user=user1)
            
        #     for evnt in evnts:
        #         data1.append(Announcement.objects.filter(event_name=evnt, to_announce="members"))
        
        data1 = []
        data1.append(Announcement.objects.filter(to_announce="members"))
        
        
        registered_users = Register_Event.objects.filter(user=user)
        
        for registered_user in registered_users:
            data1.append(Announcement.objects.filter(event_name=registered_user.event_name, to_announce="registered"))
        
        data = []
        
        for obj in data1:
            announce_dt = AnnouncementSerializer(obj, many=True)
            for announce in announce_dt.data:
                event_nm = Event.objects.get(id=announce["event_name"])
                clb_name = Club_profile.objects.get(user=event_nm.user)
                Club_prof = Club_profileSerializer(clb_name)
                # print(announce["date_srt"][0:19])
                if(Club_prof.data["profile_pic"][0]!='/'):
                    Club_prof.data["profile_pic"] = '/'+Club_prof.data["profile_pic"]

                if(Club_prof.data["title"]==club_nm):
                    ann_data = {
                        "event_name":event_nm.event_title,
                        "to_announce":announce["to_announce"],
                        "title":announce["title"],
                        "ann_description":announce["ann_description"],
                        "date_srt": datetime.strptime(announce["date_srt"][0:19], '%Y-%m-%dT%H:%M:%S'),
                        "club_title": Club_prof.data["title"],
                        "club_profile_pic": ("http://127.0.0.1:8000"+Club_prof.data["profile_pic"]),
                    }
                    data.append(ann_data)
        data.sort(key = lambda a:a["date_srt"], reverse=True)
        return Response(data)

class get_announcement_club(APIView):
    def get(self, request, club_name):
        club_name = club_name.replace('-', ' ')
        club = Club_profile.objects.get(title=club_name)
        
        announcements = Announcement.objects.filter(user=club.user)
        announce_dt = AnnouncementSerializer(announcements, many=True)
        Club_prof = Club_profileSerializer(club)
        if(Club_prof.data["profile_pic"][0]!='/'):
            Club_prof.data["profile_pic"] = '/'+Club_prof.data["profile_pic"]
        
        data = []
        for announce in announce_dt.data:
            event_nm = Event.objects.get(id=announce["event_name"])
            ann_data = {
                "event_name":event_nm.event_title,
                "to_announce":announce["to_announce"],
                "title":announce["title"],
                "ann_description":announce["ann_description"],
                "date_srt": datetime.strptime(announce["date_srt"][0:19], '%Y-%m-%dT%H:%M:%S'),
                "club_title": Club_prof.data["title"],
                "club_profile_pic": ("http://127.0.0.1:8000"+Club_prof.data["profile_pic"]),
            }
            data.append(ann_data)
        
        data.sort(key = lambda a:a["date_srt"], reverse=True)
        return Response(data)