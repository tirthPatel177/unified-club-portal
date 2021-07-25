from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from .serializers import (
    UserSerializer, BookSerializer, AuthCustomTokenSerializer, Club_profileSerializer, EventSerializer, MemberSerializer, Register_EventSerializer, AnnouncementSerializer, RatingSerializer, UserSerializer_club, event_viewSerializer
    )
from rest_framework.response import Response
from .models import (
    Book, Type_of_User, Club_profile, Event, Member, Register_Event, Announcement, Rating, event_view
    )
from backendapi.settings import EMAIL_HOST_USER
from django.shortcuts import render
from rest_framework import status
from django.contrib import auth
from rest_framework.generics import GenericAPIView
from rest_framework.views import APIView, View
from rest_framework import parsers
from rest_framework import renderers
from rest_framework.authtoken.models import Token
from django.core.exceptions import ValidationError, ObjectDoesNotExist
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.core.mail import EmailMessage, send_mail
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
            Type_of_User.objects.create(author=user, type_of_user="user")
            
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
                EMAIL_HOST_USER,
                [user.email],
            )
            
            email_send.send(fail_silently=False)

            # Club_profile.objects.update_or_create(user=user, defaults=dict(title=user, description="", tag_line = ""))
            
            return Response({"success":"A verification code has been sent to your email id"}, status=status.HTTP_201_CREATED)

        return Response({"erorr":"data is not valid"}, status=status.HTTP_400_BAD_REQUEST)
    
class UserViewSet_club(viewsets.ModelViewSet):
    serializer_class = UserSerializer_club

    def post(self, request):
        passing_data = {"email":request.data["email"], "password":request.data["password"]}
        serializer = UserSerializer_club(data=passing_data)
        
        if serializer.is_valid():
            serializer.save()
            user = User.objects.get(email = serializer.data["email"])
            Type_of_User.objects.create(author=user, type_of_user="club")
            
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
                EMAIL_HOST_USER,
                [user.email],
            )
            
            email_send.send(fail_silently=False)
            if(request.data["profile_image"]!=""):
                Club_profile.objects.create(user=user, title=request.data["title"], profile_pic=request.data["profile_image"], description=request.data["description"], tag_line = request.data["tag_line"])
            else:        
                Club_profile.objects.create(user=user, title=request.data["title"], description=request.data["description"], tag_line = request.data["tag_line"])
            return Response({"success":"A verification code has been sent to your email id"}, status=status.HTTP_201_CREATED)

        return Response({"erorr":"data is not valid"}, status=status.HTTP_400_BAD_REQUEST)
    
class club_delete(APIView):
    def post(self, request):
        title = request.data["title"]
        user = Club_profile.objects.get(title=title).user

        User.objects.get(id=user.id).delete()
        
        return Response({"success": "Club user deleted successfully"})
        
class VerificationView(APIView):    
    def get(self, request, uidb64, token):
        data = {
            "Account Status": "Activated"
        }
        user = Token.objects.get(key=token).user
        
        user.is_active = True
        user.save()
        
        return render(request, "verify.html")
    
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
                "error": e
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
                "error" : "User not found"
            }
            return Response(content)
        
class club_data_create(APIView):
    parser_classes = (parsers.MultiPartParser, parsers.FormParser)
    def post(self, request):
        try:
            old_title = request.data["old_title"]
            token = request.data["token"]
            title = request.data["title"]
            desc = request.data["description"]
            img = request.data["profile"]
            
            tag_line = request.data["tag_line"]
            
            # user = Token.objects.get(key=token).user

            obj = Club_profile.objects.get(title=old_title)

            obj.title = title
            obj.description = desc
            obj.tag_line = tag_line
            # print("------>",img, type(img))
            #  After hosting change the path to the hosting server 
            if(type(img)==str):
                if("http://127.0.0.1:8000/images" in img):
                    img = img[len("http://127.0.0.1:8000/images"):]
            obj.profile_pic = img
            obj.save()            
            # Club_profile.objects.update_or_create(user=user, defaults=dict(title=title, description=desc, profile_pic = img, tag_line = tag_line))
            
            
            cont = {
                "success" : "Updated Successfully"
            }
            
            return Response(cont,status=status.HTTP_201_CREATED)
        except IntegrityError:
            resp = {
                'error': 'Club with this name already exists!'
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
        
        club_name = club_name.replace('_',' ')
        
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
            if(date==""):
                date=datetime.now()
            
            # completed = False
            # if(request.data["completed"].lower() == 'true'):
            #     completed = True
            approved = 0
            visible = True
            if(request.data["visible"].lower() == 'true'):
                visible = True
            user = Token.objects.get(key=token).user
            document1, document2 = request.data["document1"], request.data["document2"]
            if(poster!=""):
                if(document1!="" and document2!=""):
                    document1 = request.data["document1"]
                    document2 = request.data["document2"]
                    Event.objects.create(user=user, event_title=event_title, event_description=event_description, poster = poster, date = date, approved=approved, visible=visible, document1=document1, document2=document2)
                elif(document1!="" and document2==""):
                    document1 = request.data["document1"]
                    Event.objects.create(user=user, event_title=event_title, event_description=event_description, poster = poster, date = date, approved=approved, visible=visible, document1=document1)
                elif(document2!="" and document1==""):
                    document2 = request.data["document2"]
                    Event.objects.create(user=user, event_title=event_title, event_description=event_description, poster = poster, date = date, approved=approved, visible=visible, document2=document2)
                else:
                    Event.objects.create(user=user, event_title=event_title, event_description=event_description, poster = poster, date = date, approved=approved, visible=visible)
            else:
                if(document1!="" and document2!=""):
                    document1 = request.data["document1"]
                    document2 = request.data["document2"]
                    Event.objects.create(user=user, event_title=event_title, event_description=event_description, date = date, approved=approved, visible=visible, document1=document1, document2=document2)
                elif(document1!="" and document2==""):
                    document1 = request.data["document1"]
                    Event.objects.create(user=user, event_title=event_title, event_description=event_description, date = date, approved=approved, visible=visible, document1=document1)
                elif(document2!="" and document1==""):
                    document2 = request.data["document2"]
                    Event.objects.create(user=user, event_title=event_title, event_description=event_description, date = date, approved=approved, visible=visible, document2=document2)
                else:
                    Event.objects.create(user=user, event_title=event_title, event_description=event_description, date = date, approved=approved, visible=visible)
            
            # Event.objects.update_or_create(user=user, defaults=dict(event_title=event_title, event_description=event_description, date = date[0], approved=False))
            
            cont = {
                "success" : "Event Created Successfully"
            }
            
            return Response(cont,status=status.HTTP_201_CREATED)
    
        except IntegrityError:
            resp = {
                'error': 'Event with this title already exists!'
            }
            return Response(resp, status=status.HTTP_400_BAD_REQUEST)
        except ValidationError as e:
            resp = {
                'error': 'Please enter a valid date'
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
            document1 = request.data["document1"]
            document2 = request.data["document2"]
            date = request.data["date"]
            visible = True
            completed = False
            if(request.data["completed"].lower() == 'true'):
                completed = True
            if(request.data["visible"].lower() == 'true'):
                visible = True

            user = Token.objects.get(key=token).user
            
            obj = Event.objects.get(id=id_event)
            
            obj.event_title = event_title
            obj.event_description = event_description
            if(type(poster)==str):
                if("http://127.0.0.1:8000/images" in poster):
                    poster = poster[len("http://127.0.0.1:8000/images"):]
            if(type(document1)==str):
                if("http://127.0.0.1:8000/images" in document1):
                    document1 = document1[len("http://127.0.0.1:8000/images"):]
            if(type(document2)==str):
                if("http://127.0.0.1:8000/images" in document2):
                    document2 = document2[len("http://127.0.0.1:8000/images"):]
            
            if(document1!="" and document2!=""):
                obj.document1 = document1
                obj.document2 = document2
            elif(document1!="" and document2==""):
                obj.document1 = document1
            elif(document2!="" and document1==""):
                obj.document2 = document2
            obj.poster = poster
            obj.date = date
            obj.visible = visible
            obj.completed = completed
            obj.save()        
            # # Event.objects.update_or_create(user=user, defaults=dict(event_title=event_title, event_description=event_description, date = date[0], approved=False))
            # Event.objects.create(user=user, event_title=event_title, event_description=event_description, poster = poster, date = date, approved=approved, visible=visible)
            
            cont = {
                "success" : "Event Updated Successfully"
            }
            
            return Response(cont,status=status.HTTP_201_CREATED)

        except IntegrityError:
            resp = {
                'error': 'Event with this title already exists!'
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
                rating = 0
                event_name = Event.objects.get(event_title=event["event_title"])
                rating_get = Rating.objects.filter(event_name=event_name)
                for rate in rating_get:
                    rating+=rate.rating
                if(len(rating_get)!=0):
                    rating = rating/len(rating_get)
                rating = rating//0.5
                rating = rating*0.5
                event_data = {
                    "id_event" : event["id"],
                    "event_title" : event["event_title"],
                    "event_description" : event["event_description"],
                    "poster" : ("http://127.0.0.1:8000"+event["poster"]),
                    "date" : event["date"],
                    "visible" : event["visible"],
                    "date_srt": datetime.strptime(event["date_srt"][0:19], '%Y-%m-%dT%H:%M:%S'),
                    "completed": event["completed"],
                    "approved": event["approved"],
                    "club_name" : Club_prof.data["title"],
                    "profile_pic" : ("http://127.0.0.1:8000"+Club_prof.data["profile_pic"]),
                    "rating" : rating,
                }
                
                data.append(event_data)
        
        data.sort(key = lambda a:a["date_srt"], reverse=True)
        return Response(data)
    
class events_all_admin(APIView):
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
            if(event["poster"][0]!='/'):
                event["poster"] = '/'+event["poster"]
            if(Club_prof.data["profile_pic"][0]!='/'):
                Club_prof.data["profile_pic"] = '/'+Club_prof.data["profile_pic"]
            rating = 0
            event_name = Event.objects.get(event_title=event["event_title"])
            rating_get = Rating.objects.filter(event_name=event_name)
            for rate in rating_get:
                rating+=rate.rating
            if(len(rating_get)!=0):
                rating = rating/len(rating_get)
            rating = rating//0.5
            rating = rating*0.5
            event_data = {
                "id_event" : event["id"],
                "event_title" : event["event_title"],
                "event_description" : event["event_description"],
                "poster" : ("http://127.0.0.1:8000"+event["poster"]),
                "date" : event["date"],
                "visible" : event["visible"],
                "date_srt": datetime.strptime(event["date_srt"][0:19], '%Y-%m-%dT%H:%M:%S'),
                "completed": event["completed"],
                "approved": event["approved"],
                "club_name" : Club_prof.data["title"],
                "profile_pic" : ("http://127.0.0.1:8000"+Club_prof.data["profile_pic"]),
                "rating" : rating,
            }
            
            data.append(event_data)
        
        data.sort(key = lambda a:a["date_srt"], reverse=True)
        return Response(data)

class approval(APIView):
    def post(self, request):
        id_event = request.data["id_event"]
        fut_state = request.data["fut_state"]

        obj = Event.objects.get(id=id_event)
        obj.approved = fut_state
        obj.save()
        
        event = Event.objects.get(id=id_event)
        club = Club_profile.objects.get(user=event.user)
        email_list = [event.user.email]
        if(fut_state=='1'):
            email_subject = "Approval of event"
            context = {"event_name":event.event_title, "club_name":club.title}
            message = render_to_string('email_sender_approval.html', context)
            plain_message = strip_tags(message)

            send_mail(
                email_subject,
                plain_message,
                EMAIL_HOST_USER,
                email_list,
                html_message=message
            )
        else:
            email_subject = "Rejection of event"
            context = {"event_name":event.event_title, "club_name":club.title}
            message = render_to_string('email_sender_reject.html', context)
            plain_message = strip_tags(message)

            send_mail(
                email_subject,
                plain_message,
                EMAIL_HOST_USER,
                email_list,
                html_message=message
            )


        return Response({"success":"state changed"})
        
class events_club(APIView):
    parser_classes = (parsers.MultiPartParser, parsers.FormParser)

    def post(self, request):
        
        token = request.data["token"]
        club_name = request.data["club_name"]
        user1 = Token.objects.get(key=token).user
        type_of_user = Type_of_User.objects.get(author=user1).type_of_user
        user = Club_profile.objects.get(title=club_name).user
        
        events = Event.objects.filter(user=user)
        
        serializer = EventSerializer(events, many=True)

        data = []
        i=0
        for event in serializer.data:
            club_prof = Club_profile.objects.get(user=events[i].user)
            Club_prof = Club_profileSerializer(club_prof)
            i+=1
            if(type_of_user!="club"):
                if(event["approved"]==1 and event["visible"]):
                    if(event["poster"][0]!='/'):
                        event["poster"] = '/'+event["poster"]
                    if(Club_prof.data["profile_pic"][0]!='/'):
                        Club_prof.data["profile_pic"] = '/'+Club_prof.data["profile_pic"]
                    rating = 0
                    event_name = Event.objects.get(event_title=event["event_title"])
                    rating_get = Rating.objects.filter(event_name=event_name)
                    for rate in rating_get:
                        rating+=rate.rating
                    if(len(rating_get)!=0):
                        rating = rating/len(rating_get)
                    rating = rating//0.5
                    rating = rating*0.5
                    event_data = {
                        "id_event" : event["id"],
                        "event_title" : event["event_title"],
                        "poster" : ("http://127.0.0.1:8000"+event["poster"]),
                        "date" : event["date"],
                        "visible" : event["visible"],
                        "date_srt": datetime.strptime(event["date_srt"][0:19], '%Y-%m-%dT%H:%M:%S'),
                        "completed": event["completed"],
                        "approved": event["approved"],
                        "club_name" : Club_prof.data["title"],
                        "profile_pic" : ("http://127.0.0.1:8000"+Club_prof.data["profile_pic"]),
                        "rating" : rating,
                    }
                    data.append(event_data)
            else:
                if(event["poster"][0]!='/'):
                    event["poster"] = '/'+event["poster"]
                if(Club_prof.data["profile_pic"][0]!='/'):
                    Club_prof.data["profile_pic"] = '/'+Club_prof.data["profile_pic"]
                rating = 0
                event_name = Event.objects.get(event_title=event["event_title"])
                rating_get = Rating.objects.filter(event_name=event_name)
                for rate in rating_get:
                    rating+=rate.rating
                if(len(rating_get)!=0):
                    rating = rating/len(rating_get)
                rating = rating//0.5
                rating = rating*0.5
                event_data = {
                    "id_event" : event["id"],
                    "event_title" : event["event_title"],
                    "poster" : ("http://127.0.0.1:8000"+event["poster"]),
                    "date" : event["date"],
                    "visible" : event["visible"],
                    "date_srt": datetime.strptime(event["date_srt"][0:19], '%Y-%m-%dT%H:%M:%S'),
                    "completed": event["completed"],
                    "approved": event["approved"],
                    "club_name" : Club_prof.data["title"],
                    "profile_pic" : ("http://127.0.0.1:8000"+Club_prof.data["profile_pic"]),
                    "rating" : rating,
                }
                data.append(event_data)
            
        data.sort(key = lambda a:a["date_srt"], reverse=True)
        return Response(data)
    
class events_club_cal(APIView):
    parser_classes = (parsers.MultiPartParser, parsers.FormParser)

    def get(self, request, club_name):
        club_name = club_name.replace('_',' ')
        user = Club_profile.objects.get(title=club_name).user
        events = Event.objects.filter(user=user)
        serializer = EventSerializer(events, many=True)
        data = []
        for event in serializer.data:
            if(event["approved"]==1 and event["visible"]):
                event_data = {
                    "id" : event["id"],
                    "title" : event["event_title"],
                    "date" : event["date"].split('T')[0],
                    "date_srt": datetime.strptime(event["date_srt"][0:19], '%Y-%m-%dT%H:%M:%S'),
                }
            
                data.append(event_data)    
        data.sort(key = lambda a:a["date_srt"], reverse=True)
        return Response(data)
    
class uncompleted_events(APIView):
    def get(self, request, club_name):
        
        club_name = club_name.replace('_',' ')
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
                        "date_srt": datetime.strptime(event["date_srt"][0:19], '%Y-%m-%dT%H:%M:%S'),
                    }
                
                    data.append(event_data)
        data.sort(key = lambda a:a["date_srt"], reverse=True)
        return Response(data)

class event_data_id(APIView):
    parser_classes = (parsers.MultiPartParser, parsers.FormParser)
    def post(self, request):
        token = request.data["token"]
        id_event = request.data["id_event"]
        user1 = Token.objects.get(key=token).user
        type_of_user = Type_of_User.objects.get(author=user1).type_of_user
        evnt = Event.objects.get(id=id_event)
        
        club_prof = Club_profile.objects.get(user=evnt.user)
        Club_prof = Club_profileSerializer(club_prof)
        event = EventSerializer(evnt)
        rating_get = Rating.objects.filter(event_name=evnt)
        rating = 0
        for rate in rating_get:
            rating+=rate.rating
        if(len(rating_get)!=0):
            rating = rating/len(rating_get)
        rating = rating//0.5
        rating = rating*0.5
        print(event.data)
        # print(serializer.data["poster"])
        if(event.data["poster"][0]!='/'):
            event.data["poster"] = '/'+event.data["poster"]
        if(event.data["document1"][0]!='/'):
            event.data["document1"] = '/'+event.data["document1"]
        if(event.data["document2"][0]!='/'):
            event.data["document2"] = '/'+event.data["document2"]
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
            "approved": event.data["approved"],
            "club_name" : Club_prof.data["title"],
            "profile_pic" : ("http://127.0.0.1:8000"+Club_prof.data["profile_pic"]),
            "rating": rating,
        }
        if(type_of_user!="user"):
            event_data["document1"] = ("http://127.0.0.1:8000"+event.data["document1"])
            if(event_data["document1"]=="http://127.0.0.1:8000/images/default.jpg"):
                event_data["document1"] = ""
            event_data["document2"] = ("http://127.0.0.1:8000"+event.data["document2"])
            if(event_data["document2"]=="http://127.0.0.1:8000/images/default.jpg"):
                event_data["document2"] = ""
                
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
            det = {"error": "You are already a member"}
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

class Is_member(APIView):
    throttle_classes = ()
    permission_classes = ()
    parser_classes = (parsers.FormParser,parsers.MultiPartParser,parsers.JSONParser,)
    renderer_classes = (renderers.JSONRenderer,)
    def post(self, request):
        token = request.data["token"]
        title = request.data["title"]
        title = Club_profile.objects.get(title=title)
        user = Token.objects.get(key=token).user
        if(Member.objects.filter(user=user, club_name=title).exists()):
            return Response({"user":"true"})
        return Response({"user":"false"})
        
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
            det = {"error": "Already registered"}
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
        event_name = event_name.replace('_', ' ')
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
            part_data["check_in"]=participant["check_in"]
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
        send_notification  = request.data["send_notification"]
        club_name = request.data["club_name"]
        club_name = club_name.replace('_', ' ')
        if(to_announce=="all"):
            to_announce = "members"
        user = Token.objects.get(key=token).user
        if(event_title!="None"):
            event_name = Event.objects.get(event_title=event_title)
            link = "http://localhost:3000/user/events/"+str(event_name.id)
            Announcement.objects.create(user=user, event_name=event_name, to_announce=to_announce, title=title,ann_description=ann_description, link=link)
        else:
            Announcement.objects.create(user=user, to_announce=to_announce, title=title,ann_description=ann_description)
        if(send_notification=="true"):
            emails_list = []
            if(to_announce=="members"):
                club_title = Club_profile.objects.get(title=club_name)
                members_ml = Member.objects.filter(club_name=club_title)
                for member_ml in members_ml:
                    emails_list.append(member_ml.user.email)
            else:
                event_name = Event.objects.get(event_title=event_title)
                registered_mls = Register_Event.objects.filter(event_name=event_name)
                for registered_ml in registered_mls:
                    emails_list.append(registered_ml.user.email)
                
            if(event_title!="None"):
                event_id = Event.objects.get(event_title=event_title).id
                link_event = "http://localhost:3000/user/events/"+str(event_id)
            
                email_subject = title
                context = {"desc":ann_description, "club_name":club_name, "link":link_event, "event_title":event_title}
                message = render_to_string('email_sender.html', context)
                plain_message = strip_tags(message)
                send_mail(
                    email_subject,
                    plain_message,
                    EMAIL_HOST_USER,
                    emails_list,
                    html_message=message
                )
            else:
                email_subject = title
                context = {"desc":ann_description, "club_name":club_name}
                message = render_to_string('email_sender_gen.html', context)
                plain_message = strip_tags(message)
                send_mail(
                    email_subject,
                    plain_message,
                    EMAIL_HOST_USER,
                    emails_list,
                    html_message=message
                )

            # email_send.send(fail_silently=False)
            print(emails_list)    
        
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
                user_cl = User.objects.get(id=announce["user"])
                clb_name = Club_profile.objects.get(user=user_cl)
                Club_prof = Club_profileSerializer(clb_name)
                # print(announce["date_srt"][0:19])
                if(Club_prof.data["profile_pic"][0]!='/'):
                    Club_prof.data["profile_pic"] = '/'+Club_prof.data["profile_pic"]

                if(Club_prof.data["title"]==club_nm):
                    ann_data={}
                    if(announce["event_name"]!=None):
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
                    else:
                        ann_data = {
                            "event_name":None,
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
    parser_classes = (parsers.MultiPartParser, parsers.FormParser)
    def get(self, request, club_name):
        club_name = club_name.replace('_', ' ')
        club = Club_profile.objects.get(title=club_name)
        
        announcements = Announcement.objects.filter(user=club.user)
        announce_dt = AnnouncementSerializer(announcements, many=True)
        Club_prof = Club_profileSerializer(club)
        if(Club_prof.data["profile_pic"][0]!='/'):
            Club_prof.data["profile_pic"] = '/'+Club_prof.data["profile_pic"]
        
        data = []
        for announce in announce_dt.data:
            ann_data = {}
            if(announce["event_name"]!=None):
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
            else:
                ann_data = {
                    "event_name":None,
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
    
    
class rating(APIView):
    parser_classes = (parsers.MultiPartParser, parsers.FormParser)
    def post(self, request):
        token = request.data["token"]
        event_title = request.data["event_title"]
        rating = request.data["rating"]
        
        user = Token.objects.get(key=token).user
        event_name = Event.objects.get(event_title=event_title)
        
        if(Rating.objects.filter(user=user, event_name=event_name).exists()):
            return Response({"error":"Already rated"})
        
        Rating.objects.create(user=user, event_name=event_name, rating=rating)
        return Response({"success":"Rated successfully"})
    
class Event_view(APIView):
    def post(self, request):
        token = request.data["token"]
        id_event = request.data["id_event"]
        user = Token.objects.get(key=token).user
        event_name = Event.objects.get(id=id_event)
        if(event_view.objects.filter(user=user, event_name=event_name).exists()):
            obj = event_view.objects.get(user=user, event_name=event_name)
            obj.count_views+=1
            obj.save()
        else:
            event_view.objects.create(user=user, event_name=event_name, count_views=1)
        return Response({"Success":"Viewed successfully"})

class stats_of_event(APIView):
    def post(self, request):
        id_event = request.data["id_event"]
        event_name = Event.objects.get(id=id_event)
        event = EventSerializer(event_name)
        date_event = datetime.strptime(event.data["date"][0:19], '%Y-%m-%dT%H:%M:%S')
        if(date_event<datetime.now()):            
            obj = event_view.objects.filter(event_name=event_name)
            unique_views = len(obj)
            total_views = 0
            for vi in obj:
                total_views+=vi.count_views
            registered = Register_Event.objects.filter(event_name=event_name)
            registered_part = len(registered)
            checked_in = 0
            for i in registered:
                if(i.check_in==True):
                    checked_in+=1
            
            return Response({
                "unique_views":unique_views,
                "total_views":total_views,
                "registered": registered_part,
                "checked_in": checked_in
                })
        else:
            return Response({"data":""})

class check_in_true(APIView):
    def post(self, request):
        email = request.data["user_email"]
        id_event = request.data["id_event"]
        user = User.objects.get(email=email)
        event_name = Event.objects.get(id=id_event)
        obj = Register_Event.objects.get(user=user, event_name=event_name)
        obj.check_in = True
        obj.save()
        return Response({"success":"User checked"})

class check_in_false(APIView):
    def post(self, request):
        email = request.data["user_email"]
        id_event = request.data["id_event"]
        user = User.objects.get(email=email)
        event_name = Event.objects.get(id=id_event)
        obj = Register_Event.objects.get(user=user, event_name=event_name)
        obj.check_in = False
        obj.save()
        return Response({"success":"User unchecked"})
    
    
class get_all_announcements(APIView):
    def get(self, request):
        announcements = Announcement.objects.all()
        announce_dt = AnnouncementSerializer(announcements, many=True)
        data = []
        for announce in announce_dt.data:
            user = User.objects.get(id=announce["user"])
            club = Club_profile.objects.get(user=user)
            Club_prof = Club_profileSerializer(club)
            if(Club_prof.data["profile_pic"][0]!='/'):
                Club_prof.data["profile_pic"] = '/'+Club_prof.data["profile_pic"]
            ann_data = {}
            if(announce["event_name"]!=None):
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
            else:
                ann_data = {
                    "event_name":None,
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

class stats_of_club(APIView):
    def post(self, request):
        club_name = request.data["club_name"]
        user = Club_profile.objects.get(title=club_name).user
        club_key = []
        club_val = []
        evnts = Event.objects.filter(user=user)
        total_views = 0
        st = set()
        for evnt in evnts:
            var = Register_Event.objects.filter(event_name=evnt)
            cnt = 0
            for j in var:
                if(j.check_in==True):
                    cnt+=1
            club_val.append([len(var), cnt])
            club_key.append(evnt.event_title)
            views = event_view.objects.filter(event_name=evnt)
            for j in views:
                total_views+=j.count_views
                st.add(j.user)
        
        
        resp = {
            "club_key":club_key,
            "club_val":club_val,
            "total_views":total_views,
            "total_unique_views":len(st)
        }
        return Response(resp)

class event_delete_id(APIView):
    def post(self, request):
        id = request.data["id_event"]
        event = Event.objects.get(id=id).delete()
        return Response({"success":"Event deleted successfully"})