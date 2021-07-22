from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from .models import Book, Club_profile, Event, Member, Register_Event, Announcement, Rating, event_view
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from django.core import exceptions

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        max_length=65, min_length=8, write_only=True)
    email = serializers.EmailField(max_length=255, min_length=4),
    first_name = serializers.CharField(max_length=255, min_length=2)
    last_name = serializers.CharField(max_length=255, min_length=2)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'password'
                  ]

    def validate(self, attrs):
        email = attrs.get('email', '')
        
        attrs["username"] = attrs["first_name"]+"_"+attrs["email"]
        # print("---->", attrs)
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError(
                {'email': ('Email is already in use')})
        
        return super().validate(attrs)

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        # print(user)
        return user

class UserSerializer_club(serializers.ModelSerializer):
    password = serializers.CharField(
        max_length=65, min_length=8, write_only=True)
    email = serializers.EmailField(max_length=255, min_length=4),

    class Meta:
        model = User
        fields = ['email', 'password'
                  ]

    def validate(self, attrs):
        email = attrs.get('email', '')
        attrs["username"] = "club_"+attrs["email"]
        
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError(
                {'email': ('Email is already in use')})
        
        return super().validate(attrs)

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        # print(user)
        return user    

    
class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ['id', 'title']

# Stackoverflow Code

def validateEmail( email ):
    from django.core.validators import validate_email
    from django.core.exceptions import ValidationError
    try:
        validate_email( email )
        return True
    except ValidationError:
        return False

class AuthCustomTokenSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField()

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            # Check if user sent email
            if validateEmail(email):
                user_request = get_object_or_404(
                    User,
                    email=email,
                )

                email = user_request.username

            user = authenticate(username=email, password=password)

            usr = User.objects.get(username=email)

            if usr:
                if not usr.is_active:
                    msg = ('Please verify your email!!')
                    raise exceptions.ValidationError(msg)
            if not user:
                msg = ('Unable to log in with provided credentials.')
                raise exceptions.ValidationError(msg)
        else:
            msg = _('Must include "email or username" and "password"')
            raise exceptions.ValidationError(msg)

        attrs['user'] = user
        return attrs
        
        
class Club_profileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Club_profile
        fields = '__all__'


class EventSerializer(serializers.ModelSerializer):
    date = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%S")
    class Meta:
        model = Event
        fields = '__all__'
        
class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = '__all__'
class Register_EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Register_Event
        fields = '__all__'
        

class AnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = '__all__'
        
class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = '__all__'

class event_viewSerializer(serializers.ModelSerializer):
    class Meta:
        model = event_view
        fields = '__all__'