from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.settings import api_settings
from django.conf import settings
from datetime import datetime
import pytz

from users.models import User
from users.serializers import UserSerializer, UserRegistrationSerializer, CustomTokenObtainPairSerializer

class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminUser]
    queryset = User.objects.all()
    serializer_class = UserSerializer

class RegistrationView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
    def put(self, request):
        user = request.user

        try:
            serializer = UserSerializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        try:
            current_password = request.data['current_password']
            new_password = request.data['new_password']

            if not user.check_password(current_password):
                return Response(
                    {"error": "Obecne hasło jest nieprawidłowe"},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            try:
                validate_password(new_password, user=user)
            except ValidationError as e:
                return Response(
                    {"error": e.messages},
                    status=status.HTTP_400_BAD_REQUEST
                )

            user.set_password(new_password)
            user.save()

        except KeyError as e:
            return Response(
                {"error": f"{str(e)} musi być podane"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        return Response({"message": "Hasło zmienione pomyślnie"})

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            access_token = response.data.get('access')
            refresh_token = response.data.get('refresh')

            access_lifetime = settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME']
            refresh_lifetime = settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME']
            
            response.set_cookie(
                key='accessToken',
                value=access_token,
                expires=datetime.now(pytz.utc) + access_lifetime,
                secure=True,
                httponly=True,
                samesite='None'
            )

            response.set_cookie(
                key='refreshToken',
                value=refresh_token,
                expires=datetime.now(pytz.utc) + refresh_lifetime,
                secure=True,
                httponly=True,
                samesite='None'
            )
            del response.data['access']
            del response.data['refresh']

        return response
    
class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get("refreshToken")
        
        if not refresh_token:
            return Response(
                {"detail": "Nie znaleziono tokenu odświeżania w ciasteczkach."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        data = {'refresh': refresh_token}
        
        serializer = self.get_serializer(data=data)

        try:
            serializer.is_valid(raise_exception=True)
        except Exception:
            return Response(
                {"detail": "Token jest nieprawidłowy lub wygasł."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        response_data = serializer.validated_data
        
        access_token = response_data.get('access')
        
        access_lifetime = api_settings.ACCESS_TOKEN_LIFETIME 
        refresh_lifetime = api_settings.REFRESH_TOKEN_LIFETIME
        now = datetime.now(pytz.utc)
        
        response = Response(response_data, status=status.HTTP_200_OK)

        response.set_cookie(
            key='accessToken',
            value=access_token,
            expires=now + access_lifetime,
            secure=True,
            httponly=True,
            samesite='None'
        )
        
        if 'refresh' in response_data:
            refresh_token = response_data['refresh']
            response.set_cookie(
                key='refreshToken',
                value=refresh_token,
                expires=now + refresh_lifetime,
                secure=True,
                httponly=True,
                samesite='None'
            )

        response.data.pop('access', None)
        response.data.pop('refresh', None)

        return response

class UserIsStaffView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({"is_staff": user.is_staff})
    

class LogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.COOKIES.get('refreshToken')
    
        if not refresh_token:
            response = Response({"detail": "Nie znaleziono tokenu odświeżania w ciasteczkach."}, status=status.HTTP_400_BAD_REQUEST)
            response.delete_cookie('accessToken')
            response.delete_cookie('refreshToken')
            return response
            
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            
            response = Response({"detail": "Wylogowano pomyślnie."}, status=status.HTTP_200_OK)
            response.delete_cookie('accessToken')
            response.delete_cookie('refreshToken')

            return response
            
        except TokenError:
            response = Response(
                {"detail": "Token jest nieprawidłowy lub wygasł."},
                status=status.HTTP_400_BAD_REQUEST
            )
            response.delete_cookie('accessToken')
            response.delete_cookie('refreshToken')
            return response
