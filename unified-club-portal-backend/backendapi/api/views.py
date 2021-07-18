from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from .serializers import UserSerializer, BookSerializer, AuthCustomTokenSerializer, Club_profileSerializer, EventSerializer, MemberSerializer, Register_EventSerializer
from rest_framework.response import Response
from .models import Book, Type_of_User, Club_profile, Event, Member, Register_Event
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
                img = img[len("http://127.0.0.1:8000/images"):]
            
            Club_profile.objects.update_or_create(user=user, defaults=dict(title=title, description=desc, profile_pic = img, tag_line = tag_line))
            
            
            cont = {
                "status" : "Updated Successfully"
            }
            
            return Response(cont,status=status.HTTP_201_CREATED)
        except IntegrityError:
            resp = {
                'Error': 'Club with that name already exists!'
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
        Event.objects.update_or_create(user=user, defaults=dict(event_title=event_title, event_description=event_description, poster = poster, date = date, approved=approved, visible=visible))
        
        cont = {
            "status" : "Event Created Successfully"
        }
        
        return Response(cont,status=status.HTTP_201_CREATED)
    
class events_all(APIView):
    parser_classes = (parsers.MultiPartParser, parsers.FormParser)


    def get(self, request):

        events = Event.objects.all()
        
        serializer = EventSerializer(events, many=True)
        
        
        data = []
        i = 0
        for event in serializer.data:
            club_prof = Club_profile.objects.get(user=events[i].user)
            i+=1
            if(event["approved"]==1 and event["visible"]):
                event_data = {
                    "event_title" : event["event_title"],
                    "event_description" : event["event_description"],
                    "poster" : ("http://127.0.0.1:8000"+event["poster"]),
                    "date" : event["date"],
                    "club_name" : club_prof.title,
                    "profile_pic" : ("http://127.0.0.1:8000"+str(club_prof.profile_pic)),
                    
                }
                
                data.append(event_data)
        
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
            i+=1
            if(event["approved"]==1 and event["visible"]):
                event_data = {
                    "event_title" : event["event_title"],
                    "event_description" : event["event_description"],
                    "poster" : ("http://127.0.0.1:8000"+event["poster"]),
                    "date" : event["date"],
                    "club_name" : club_prof.title,
                    "profile_pic" : ("http://127.0.0.1:8000"+str(club_prof.profile_pic)),
                    
                }
            
                data.append(event_data)    

        return Response(data)
    
    
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
        event_name = request.data["event_name"]
        mobile_no = request.data["mobile_no"]
        roll_no = request.data["roll_no"]

        user = Token.objects.get(key=token).user
        
        if(Register_Event.objects.filter(user=user, event_name=event_name).exists()):
            det = {"Error": "Already registered"}
            return Response(det, status=status.HTTP_400_BAD_REQUEST)
        else:
            Register_Event.objects.create(user=user, event_name=event_name, mobile_no=mobile_no, roll_no=roll_no)

        det = {"success":"Registered successfully"}
        return Response(det, status=status.HTTP_201_CREATED)

class Registered_users(APIView):
    def get(self, request, event_name):
        event_name = event_name.replace('-', ' ')
        participants = Register_Event.objects.filter(event_name=event_name)

        data = []
        for participant in participants:
            part_data = {}
            part_data["first_name"]=participant.user.first_name
            part_data["last_name"]=participant.user.last_name
            part_data["email"]=participant.user.email
            part_data["mobile_no"]=participant.mobile_no
            part_data["roll_no"]=participant.roll_no
            
            data.append(part_data)
        return Response(data)