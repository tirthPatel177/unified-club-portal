from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from .serializers import UserSerializer, BookSerializer, AuthCustomTokenSerializer
from rest_framework.response import Response
from .models import Book, Type_of_User, Club_profile
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
            user = Token.objects.get(key=request.POST.get("key", "")).user
            
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
        token = request.data["token"]
        title = request.data["title"]
        desc = request.data["description"]
        # img = request.data["profile_image"]

        user = Token.objects.get(key=token).user

        
        
        Club_profile.objects.update_or_create(user=user, defaults=dict(title=title, description=desc))
        # Club_profile.objects.create(user=user, title=title, description=desc, profile_pic=img)
        
        cont = {
            "status" : "Created Successfully"
        }
        
        return Response(cont,status=status.HTTP_201_CREATED)



class club_data(APIView):
    def post(self, request):
        token = request.data["token"]
        user = Token.objects.get(key=token).user
        
        clb = Club_profile.objects.get(user=user)
        
        # print(clb.profile_pic)
        
        cont = {
            "title" : clb.title,
            "description" : clb.description,
            "profile" : str(clb.profile_pic),
        }
        
        return Response(cont)
    
