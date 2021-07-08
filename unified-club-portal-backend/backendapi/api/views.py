from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from .serializers import UserSerializer, BookSerializer, AuthCustomTokenSerializer
from rest_framework.response import Response
from .models import Book, Type_of_User
from rest_framework import status
from django.contrib import auth
from rest_framework.generics import GenericAPIView
from rest_framework.views import APIView
from rest_framework import parsers
from rest_framework import renderers
from rest_framework.authtoken.models import Token
from django.core.exceptions import ValidationError, ObjectDoesNotExist


class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        # print("--->>>",serializer)
        if serializer.is_valid():
            serializer.save()
            user = User.objects.get(email = serializer.data["email"])
            Type_of_User.objects.create(author=user, type_of_user=request.data["type_of_user"])
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
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