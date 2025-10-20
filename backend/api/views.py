from rest_framework import viewsets, status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from django.core.exceptions import ObjectDoesNotExist
from django.utils import timezone


from raports.models import Raport, RaportReview
from users.models import User
from publishers.models import Publisher, PublisherMembership

from raports.serializers import RaportSerializer, RaportReviewSerializer, RaportListSerializer, AuthorRaportSerializer, ReviewerRaportSerializer, AdminRaportSerializer, CreateReviewSerializer
from users.serializers import UserSerializer, UserRegistrationSerializer
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

        def post(self, request, *args, **kwargs):
            publisher_id = self.kwargs['pk']

            try:
                user_id = request.data['user_id']
                user_id = int(user_id)
                user = User.objects.get(id=user_id)
                membership = PublisherMembership.objects.get(user_id=user_id, publisher_id=publisher_id)
                membership.delete()
            except KeyError:
                return Response(
                    {"error": "user_id must be provided"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )
            except ValueError:
                return Response(
                    {"error": "user_id must be an integer"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )
            except ObjectDoesNotExist as e:
                return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response(
                    {"error": str(e)},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )

            return Response({"message": "Member deleted"})

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
                "review_raports": review_serializer.data
            }
            return Response(user_raports, status=status.HTTP_200_OK)
    
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
    
    class PublisherRaportsView(APIView):
        serializer_class = RaportSerializer
        permission_classes = [IsAuthenticated]

        def get(self, request, *args, **kwargs):
            publisher_id = self.kwargs['pk']
            user = self.request.user

            if user.is_staff:
                raports = Raport.objects.filter(publisher__id=publisher_id)
                serializer = self.serializer_class(raports, many=True)
                return Response({"all_raports": serializer.data})
            else:
                authored_raports = Raport.objects.filter(publisher__id=publisher_id, author=user)

                review_raports = Raport.objects.filter(publisher__id=publisher_id, reviewers=user)

                authored_serializer = self.serializer_class(authored_raports, many=True)
                review_serializer = self.serializer_class(review_raports, many=True)

                return Response({
                    "authored_raports": authored_serializer.data,
                    "review_raports": review_serializer.data
                })
    
    class PublishersView(generics.ListAPIView):
        serializer_class = PublisherSerializer
        permission_classes = [IsAuthenticated]

        def get_queryset(self):
            user = self.request.user
            return Publisher.objects.filter(members=user)
        
    class PublisherDetailView(APIView):
        permission_classes = [IsAuthenticated]

        def get(self, request, pk):
            user = request.user

            try:
                membership = PublisherMembership.objects.get(user_id=user.id, publisher_id=pk)
                publisher = Publisher.objects.get(id=membership.publisher_id)
                publisher_serializer = PublisherSerializer(publisher)

            except ObjectDoesNotExist:
                return Response(
                    {"error": "you are not a member of this publisher"},
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
                {"message": "Joined publisher"}
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
        
            
    class RaportView(APIView):
        permission_classes = [IsAuthenticated]

        def get(self, request, pk):
            user = request.user

            try:
                raport = Raport.objects.get(id=pk)

                if user.is_staff:
                    serializer = AdminRaportSerializer(raport)
                elif user == raport.author:
                    serializer = AuthorRaportSerializer(raport)
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
                
    class CreateRaportView(APIView):
        permission_classes = [IsAuthenticated]

        def post(self, request):
            user = request.user

            try:
                publisher_id = request.data.get('publisher')
                if not publisher_id:
                    return Response({"error": "Publisher ID must be provided."}, status=status.HTTP_400_BAD_REQUEST)

                if not PublisherMembership.objects.filter(publisher_id=publisher_id, user=user).exists():
                    return Response({"error": "You must be a member of the publisher to create a raport."}, status=status.HTTP_403_FORBIDDEN)

                if Raport.objects.filter(publisher_id=publisher_id, author=user).exists():
                    return Response({"error": "You can only publish one raport for each publisher."}, status=status.HTTP_400_BAD_REQUEST)

                serializer = RaportSerializer(data=request.data)
                if serializer.is_valid():
                    raport = serializer.save(author=user)
                    return Response(RaportSerializer(raport).data, status=status.HTTP_201_CREATED)
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