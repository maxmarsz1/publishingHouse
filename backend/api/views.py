from rest_framework import viewsets, status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework import exceptions
from django.core.exceptions import ObjectDoesNotExist
from django.utils import timezone
from rest_framework_simplejwt.views import TokenObtainPairView
from django.conf import settings
from datetime import datetime, timedelta
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken
import pytz


from raports.models import Raport, RaportReview
from users.models import User
from publishers.models import Publisher, PublisherMembership

from raports.serializers import RaportSerializer, NewOrUpdateRaportSerializer, RaportReviewSerializer, RaportListSerializer, AuthorRaportSerializer, ReviewerRaportSerializer, AdminRaportSerializer, CreateReviewSerializer
from users.serializers import UserSerializer, UserRegistrationSerializer, CustomTokenObtainPairSerializer
from publishers.serializers import PublisherSerializer, PublisherMembershipSerializer


class AdminViews:
    class RaportViewSet(viewsets.ModelViewSet):
        permission_classes = [IsAdminUser]
        queryset = Raport.objects.all()
        serializer_class = RaportSerializer
        
    class RaportReviewViewSet(viewsets.ModelViewSet):
        permission_classes = [IsAdminUser]
        queryset = RaportReview.objects.all()
        serializer_class = RaportReviewSerializer
        
    class UserViewSet(viewsets.ModelViewSet):
        permission_classes = [IsAdminUser]
        queryset = User.objects.all()
        serializer_class = UserSerializer
        
    class PublisherViewSet(viewsets.ModelViewSet):
        permission_classes = [IsAdminUser]
        queryset = Publisher.objects.all()
        serializer_class = PublisherSerializer
        
    class PublisherMembershipViewSet(viewsets.ModelViewSet):
        permission_classes = [IsAdminUser]
        queryset = PublisherMembership.objects.all()
        serializer_class = PublisherMembershipSerializer

    class DeleteMemberView(APIView):
        permission_classes = [IsAuthenticated]

        def delete(self, request, *args, **kwargs):
            publisher_id = self.kwargs['publisher_id']
            user_id = self.kwargs['user_id']

            try:
                user = User.objects.get(id=user_id)
                membership = PublisherMembership.objects.get(user_id=user_id, publisher_id=publisher_id)
                membership.delete()
            except ObjectDoesNotExist:
                return Response(
                    {"error": "User or membership does not exist."}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            except Exception as e:
                return Response(
                    {"error": str(e)}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            return Response(
                {"message": f"User {user.username} removed from publisher."}, 
                status=status.HTTP_200_OK
            )

    class ListMembersView(APIView):
        serializer_class = UserSerializer
        permission_classes = [IsAuthenticated]

        def get(self, request, *args, **kwargs):
            publisher_id = self.kwargs['pk']

            try:
                memberships = PublisherMembership.objects.filter(publisher_id=publisher_id)
                user_ids = memberships.values_list('user_id', flat=True)
                members = User.objects.filter(id__in=user_ids)
                members_serializer = self.serializer_class(members, many=True)
            except Exception as e:
                return Response(
                    {"error": "Could not retrieve members."}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
            return Response(members_serializer.data, status=status.HTTP_200_OK)
        
    class GeneratePublisherJoinCode(APIView):
        permission_classes = [IsAuthenticated]

        def get(self, request, *args, **kwargs):
            publisher_id = self.kwargs['pk']

            try:
                publisher = Publisher.objects.get(id=publisher_id)
                new_join_code = Publisher.generate_join_code()
                publisher.join_code = new_join_code
                publisher.save()
            except ObjectDoesNotExist:
                return Response(
                    {"error": "Publisher does not exist."}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            except Exception as e:
                return Response(
                    {"error": str(e)}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            return Response(
                {"join_code": new_join_code}, 
                status=status.HTTP_200_OK
            )


class UserViews:
    class RaportsView(APIView):
        serializer_class = RaportListSerializer
        permission_classes = [IsAuthenticated]

        def get(self, request):
            user = self.request.user
            authored_raports = Raport.objects.filter(author=user)
            review_raports = Raport.objects.filter(reviewers=user)
            
            authored_serializer = self.serializer_class(authored_raports, many=True)
            review_serializer = self.serializer_class(review_raports, many=True)
            
            user_raports = {
                "authored_raports": authored_serializer.data,
                "raports_to_review": review_serializer.data
            }
            return Response(user_raports, status=status.HTTP_200_OK)
        
        
    class RaportDetailUpdateDeleteView(APIView):
        permission_classes = [IsAuthenticated]

        def get(self, request, pk):
            user = request.user

            try:
                raport = Raport.objects.get(id=pk)

                if user.is_staff:
                    serializer = AdminRaportSerializer(raport)
                elif user == raport.author:
                    serializer = AuthorRaportSerializer(raport)
                    data = serializer.data
                    data['is_author'] = True
                    return Response(data)
                elif user in raport.reviewers.all():
                    serializer = ReviewerRaportSerializer(raport, context={'request': request})
                else:
                    return Response(
                        {"error": "You do not have permission to view this raport"},
                        status=status.HTTP_403_FORBIDDEN
                    )

                return Response(serializer.data)

            except ObjectDoesNotExist:
                return Response(
                    {"error": "Raport does not exist"},
                    status=status.HTTP_404_NOT_FOUND
                )
            except Exception as e:
                return Response(
                    {"error": str(e)},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
                
        def put(self, request, pk):
            user = request.user

            try:
                raport = Raport.objects.get(id=pk)

                if user != raport.author:
                    return Response(
                        {"error": "You do not have permission to update this raport."},
                        status=status.HTTP_403_FORBIDDEN
                    )

                serializer = NewOrUpdateRaportSerializer(raport, data=request.data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_200_OK)
                else:
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            except ObjectDoesNotExist:
                return Response(
                    {"error": "Raport does not exist."},
                    status=status.HTTP_404_NOT_FOUND
                )
            except Exception as e:
                return Response(
                    {"error": str(e)},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        def delete(self, request, pk):
            user = request.user

            try:
                raport = Raport.objects.get(id=pk)

                if user != raport.author and not user.is_superuser:
                    return Response(
                        {"error": "You do not have permission to delete this raport."},
                        status=status.HTTP_403_FORBIDDEN
                    )

                raport.delete()
                return Response(
                    {"message": "Raport deleted successfully."},
                    status=status.HTTP_200_OK
                )

            except ObjectDoesNotExist:
                return Response(
                    {"error": "Raport does not exist."},
                    status=status.HTTP_404_NOT_FOUND
                )
            except Exception as e:
                return Response(
                    {"error": str(e)},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
                
    class CreateRaportView(APIView):
        permission_classes = [IsAuthenticated]

        def post(self, request, pk):
            user = request.user

            try:
                publisher = Publisher.objects.get(id=pk)
                if not PublisherMembership.objects.filter(publisher_id=publisher.id, user=user).exists():
                    return Response({"error": "You must be a member of the publisher to create a raport."}, status=status.HTTP_403_FORBIDDEN)

                if Raport.objects.filter(publisher_id=publisher.id, author=user).exists():
                    return Response({"error": "You can only publish one raport for each publisher."}, status=status.HTTP_400_BAD_REQUEST)

                serializer = NewOrUpdateRaportSerializer(data=request.data)
                if serializer.is_valid():
                    raport = serializer.save(author=user, publisher=publisher)
                    return Response(RaportSerializer(raport).data, status=status.HTTP_201_CREATED)
                else:
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            except Exception as e:
                return Response(
                    {"error": str(e)},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
    
    class PublisherRaportsView(APIView):
        serializer_class = RaportSerializer
        permission_classes = [IsAuthenticated]

        def get(self, request, *args, **kwargs):
            publisher_id = self.kwargs['pk']
            user = self.request.user

            if user.is_staff:
                raports = Raport.objects.filter(publisher__id=publisher_id)
                serializer = AdminRaportSerializer(raports, many=True)
                return Response({"all_raports": serializer.data})
            else:
                authored_raports = Raport.objects.filter(publisher__id=publisher_id, author=user)

                review_raports = Raport.objects.filter(publisher__id=publisher_id, reviewers=user)

                authored_serializer = self.serializer_class(authored_raports, many=True)
                review_serializer = self.serializer_class(review_raports, many=True)

                return Response({
                    "authored_raports": authored_serializer.data,
                    "raports_to_review": review_serializer.data
                })
    
    class PublishersView(generics.ListAPIView):
        serializer_class = PublisherSerializer
        permission_classes = [IsAuthenticated]

        def get_queryset(self):
            user = self.request.user
            if user.is_staff:
                return Publisher.objects.all()
            return Publisher.objects.filter(members=user)
        
    class PublisherDetailView(APIView):
        permission_classes = [IsAuthenticated]

        def get(self, request, pk):
            user = request.user

            try:
                if user.is_staff:
                    publisher = Publisher.objects.get(id=pk)
                else:
                    membership = PublisherMembership.objects.get(user_id=user.id, publisher_id=pk)
                    publisher = Publisher.objects.get(id=membership.publisher_id)
                publisher_serializer = PublisherSerializer(publisher)

            except ObjectDoesNotExist:
                return Response(
                    {"error": "Publisher doesn't exist or you're not a member"},
                    status.HTTP_404_NOT_FOUND
                    )
            except Exception as e:
                return Response(
                    {"error": str(e)},
                    status.HTTP_500_INTERNAL_SERVER_ERROR
                    )

            return Response(publisher_serializer.data)

    class JoinPublisherView(APIView):
        permission_classes = [IsAuthenticated]

        def post(self, request):
            user = request.user

            try:
                join_code = request.data['join_code']
                publisher = Publisher.objects.get(join_code=join_code)
                
                if PublisherMembership.objects.filter(user_id=user.id, publisher_id=publisher.id).exists():
                    return Response(
                        {"error": "You are already a member of this publisher."},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                membership = PublisherMembership(user_id=user.id, publisher_id=publisher.id)
                membership.save()
                    
            except KeyError as e:
                return Response(
                    {"error": f"join_code must be provided ({str(e)})"},
                    status.HTTP_500_INTERNAL_SERVER_ERROR
                    )
            except ObjectDoesNotExist:
                return Response(
                    {"error": "invalid join code"},
                    status.HTTP_404_NOT_FOUND
                    )
            except Exception as e:
                return Response(
                    {"error": str(e)},
                    status.HTTP_500_INTERNAL_SERVER_ERROR
                    )

            return Response(
                PublisherSerializer(publisher).data
            )
            
    class CreateReviewView(APIView):
        permission_classes = [IsAuthenticated]

        def post(self, request, pk):
            user = request.user

            try:
                data = request.data.copy()
                data['raport_id'] = pk

                serializer = CreateReviewSerializer(data=data, context={'request': request})
                if serializer.is_valid():
                    serializer.save(reviewer=user)
                    return Response({"message": "Review created successfully"}, status=status.HTTP_201_CREATED)
                else:
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    
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
    
    class ChangePasswordView(APIView):
        permission_classes = [IsAuthenticated]

        def post(self, request):
            user = request.user

            try:
                current_password = request.data['current_password']
                new_password = request.data['new_password']
                new_password_repeat = request.data['new_password_repeat']

                if not user.check_password(current_password):
                    return Response(
                        {"error": "Current password is incorrect"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                if new_password != new_password_repeat:
                    return Response(
                        {"error": "New passwords do not match"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                user.set_password(new_password)
                user.save()

            except KeyError as e:
                return Response(
                    {"error": f"{str(e)} must be provided"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )
            except Exception as e:
                return Response(
                    {"error": str(e)},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )

            return Response({"message": "Password changed successfully"})

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
                    secure=settings.SECURE_PROXY_SSL_HEADER is not None,
                    httponly=True,
                    samesite='Lax'
                )

                response.set_cookie(
                    key='refreshToken',
                    value=refresh_token,
                    expires=datetime.now(pytz.utc) + refresh_lifetime,
                    secure=settings.SECURE_PROXY_SSL_HEADER is not None,
                    httponly=True,
                    samesite='Lax'
                )
                del response.data['access']
                del response.data['refresh']

            return response

    

    class LogoutView(APIView):
        permission_classes = [IsAuthenticated]

        def post(self, request):
            refresh_token = request.COOKIES.get('refreshToken')
        
            if not refresh_token:
                return Response({"detail": "Refresh token not found in cookies."}, status=status.HTTP_400_BAD_REQUEST)
                
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
                
                response = Response({"detail": "Successfully logged out."}, status=status.HTTP_200_OK)
                response.delete_cookie('accessToken')
                response.delete_cookie('refreshToken')

                return response
                
            except TokenError:
                return Response(
                    {"detail": "Token is invalid or expired."},
                    status=status.HTTP_400_BAD_REQUEST
                )