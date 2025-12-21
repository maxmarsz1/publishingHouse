from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework import exceptions
from django.core.exceptions import ObjectDoesNotExist
from django.utils import timezone
from django.http import FileResponse
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.exceptions import InvalidToken
from django.conf import settings
from datetime import datetime, timedelta
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.settings import api_settings
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
import pytz, random


from raports.models import Raport, RaportReview
from users.models import User
from publishers.models import Publisher, PublisherMembership

from raports.serializers import RaportSerializer, RaportReviewReviewerSerializer, PublisherRaportsSerializer, NewOrUpdateRaportSerializer, RaportReviewSerializer, RaportListSerializer, AuthorRaportSerializer, ReviewerRaportSerializer, AdminRaportSerializer, CreateReviewSerializer
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
        
        @action(detail=True, methods=['post'])
        def approve(self, request, pk=None):
            review = self.get_object()
            if review.status != RaportReview.RaportReviewStatus.SUBMITTED:
                return Response(
                    {"error": "Tylko przesłane recenzje mogą zostać zatwierdzone."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            review.status = RaportReview.RaportReviewStatus.APPROVED
            review.save()
            return Response({'status': 'review approved'}, status=status.HTTP_200_OK)
        
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
                    {"error": "Użytkownik lub członkostwo nie istnieje."}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            except Exception as e:
                return Response(
                    {"error": str(e)}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            return Response(
                {"message": f"Użytkownik {user.username} został usunięty z wydawnictwa."}, 
                status=status.HTTP_200_OK
            )
            
    class AcceptAllReviewsView(APIView):
        permission_classes = [IsAuthenticated]

        def post(self, request, pk):
            try:
                publisher = Publisher.objects.get(id=pk)
                
                # Check if user is admin/owner/member with permissions. 
                # Ideally, check if user is in members of the publisher.
                # Assuming simple check for now or based on IsAdminUser in ViewSet
                # Reusing similar logic to DistributeReviewsView which doesn't seem to explicitly check 'is_owner' but relies on membership or being staff.
                
                # Let's enforce that the user is a member of the publisher or staff
                if not request.user.is_staff and not publisher.members.filter(id=request.user.id).exists():
                     return Response({"error": "Brak uprawnień."}, status=status.HTTP_403_FORBIDDEN)

                raports = Raport.objects.filter(publisher=publisher)
                reviews = RaportReview.objects.filter(
                    raport__in=raports,
                    status=RaportReview.RaportReviewStatus.SUBMITTED
                )
                
                count = reviews.count()
                if count == 0:
                     return Response({"message": "Brak recenzji do zatwierdzenia."}, status=status.HTTP_200_OK)

                reviews.update(status=RaportReview.RaportReviewStatus.APPROVED)
                
                return Response(
                    {"message": f"Zatwierdzono {count} recenzji."}, 
                    status=status.HTTP_200_OK
                )
            except Publisher.DoesNotExist:
                 return Response({"error": "Wydawnictwo nie istnieje."}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
                    {"error": "Nie udało się pobrać członków."}, 
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
                    {"error": "Wydawnictwo nie istnieje."}, 
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


    class DistributeReviewsView(APIView):
        permission_classes = [IsAdminUser]

        def post(self, request, pk):
            publisher_id = pk
            try:
                publisher = Publisher.objects.get(id=publisher_id)
                
                pending_raports = list(Raport.objects.filter(publisher=publisher, status=Raport.RaportStatus.PENDING).select_related('author'))
                
                memberships = PublisherMembership.objects.filter(publisher=publisher)
                member_user_ids = memberships.values_list('user', flat=True)
                members = list(User.objects.filter(id__in=member_user_ids))
                
                invites_sent_count = 0
                
                # Filter to only members who HAVE a pending report to ensure the N users <-> N reports mapping for circular shift
                # Ideally, we create a list of (Member, Report) pairs.
                # If a member has multiple reports or no reports, this simple circle might need adjustment, 
                # For robustness, we will map users to their primary pending report.
                
                pairs = []
                used_reports = set()
                
                for member in members:
                    # Find a pending report by this member
                    member_reports = [
                        r for r in pending_raports 
                        if r.author_id == member.id 
                        and r.id not in used_reports 
                        and not r.raport_reviews.exists()
                    ]
                    if member_reports:
                        pairs.append({'member': member, 'report': member_reports[0]})
                        used_reports.add(member_reports[0].id)
                
                n = len(pairs)
                if n < 2:
                     # Fallback or error if not enough participants for circular shift without self-review issues (though n=2 works with swap)
                     # But n=15 is expected.
                     if n == 0:
                          return Response({"message": "Brak użytkowników do rozdziału."}, status=status.HTTP_200_OK)
                     else:
                          return Response({"message": f"Zbyt mało uczestników do rozdziału recenzji."}, status=status.HTTP_200_OK)
                
                random.shuffle(pairs)
                
                for i in range(n):
                    reviewer = pairs[i]['member']
                    
                    # Target indices in the circle
                    idx1 = (i + 1) % n
                    idx2 = (i + 2) % n
                    
                    # If n is small (e.g. 2), idx2 might be same as i (self-review).
                    # For n=2: i=0 gets 1, 0(self). i=1 gets 0, 1(self).
                    # So we ensure we don't assign self.
                    
                    targets = []
                    if pairs[idx1]['member'].id != reviewer.id:
                        targets.append(pairs[idx1]['report'])
                    
                    if pairs[idx2]['member'].id != reviewer.id and idx2 != idx1: # Avoid duplicate if n=1?
                        targets.append(pairs[idx2]['report'])

                    for raport in targets:
                        if not RaportReview.objects.filter(raport=raport, reviewer=reviewer).exists():
                            RaportReview.objects.create(
                                raport=raport,
                                reviewer=reviewer,
                                status=RaportReview.RaportReviewStatus.INVITE_SENT
                            )
                            invites_sent_count += 1

                return Response({"message": f"Rozdzielono recenzje. Wysłano {invites_sent_count} zaproszeń dla {n} uczestników."}, status=status.HTTP_200_OK)

            except Publisher.DoesNotExist:
                 return Response({"error": "Wydawnictwo nie istnieje."}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserViews:
    class RaportsView(APIView):
        serializer_class = RaportListSerializer
        permission_classes = [IsAuthenticated]

        def get(self, request):
            user = self.request.user
            authored_raports = Raport.objects.filter(author=user)
            user_reviews = RaportReview.objects.filter(reviewer=user)
            
            authored_serializer = self.serializer_class(authored_raports, many=True)
            reviews_serializer = RaportReviewReviewerSerializer(user_reviews, many=True)
            
            user_raports = {
                "authored_raports": authored_serializer.data,
                "user_reviews": reviews_serializer.data
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
                        {"error": "Nie masz uprawnień do przeglądania tego raportu."},
                        status=status.HTTP_403_FORBIDDEN
                    )

                return Response(serializer.data)

            except ObjectDoesNotExist:
                return Response(
                    {"error": "Raport nie istnieje."},
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
                        {"error": "Nie masz uprawnień do edycji tego raportu."},
                        status=status.HTTP_403_FORBIDDEN
                    )
                    
                if raport.publisher.due_date and raport.publisher.due_date < timezone.now().date():
                    return Response(
                        {"error": "Nie można zaktualizować tego raportu. Termin wydawcy minął."},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                if raport.status in [Raport.RaportStatus.APPROVED, Raport.RaportStatus.PUBLISHED, Raport.RaportStatus.REJECTED]:
                    return Response(
                        {"error": "Nie można zaktualizować tego raportu. Jego status nie pozwala na aktualizacje."},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                serializer = NewOrUpdateRaportSerializer(raport, data=request.data, partial=True)
                if serializer.is_valid():
                    # Check status BEFORE saving, but use saved instance for further updates
                    was_waiting_for_revision = raport.status == Raport.RaportStatus.WAITING_FOR_REVISION
                    
                    updated_raport = serializer.save()
                    
                    if was_waiting_for_revision:
                        updated_raport.status = Raport.RaportStatus.PENDING
                        updated_raport.save()
                        
                        reviews = updated_raport.raport_reviews.all()
                        for review in reviews:
                            if review.reviewer.is_staff:
                                review.delete()
                            else:
                                review.comment = None
                                review.grade = None
                                review.decision = None
                                review.review_date = None
                                
                                # Clear all score fields
                                review.content_consistency = None
                                review.goal_formulation = None
                                review.structure_correctness = None
                                review.terminology_relevance = None
                                review.graphic_design = None
                                review.aesthetics = None
                                review.literature_selection = None
                                review.conclusions_correctness = None
                                review.goal_achievement = None
                                review.language_correctness = None
                                
                                review.status = RaportReview.RaportReviewStatus.PENDING
                                review.save()
                        
                    return Response(serializer.data, status=status.HTTP_200_OK)
                else:
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            except ObjectDoesNotExist:
                return Response(
                    {"error": "Raport nie istnieje."},
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
                        {"error": "Nie masz uprawnień do usunięcia tego raportu."},
                        status=status.HTTP_403_FORBIDDEN
                    )
                    
                if raport.publisher.due_date and raport.publisher.due_date < timezone.now():
                    return Response(
                        {"error": "Nie można usunąć raportu. Termin wydawcy minął."},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                raport.delete()
                return Response(
                    {"message": "Raport usunięty pomyślnie."},
                    status=status.HTTP_200_OK
                )

            except ObjectDoesNotExist:
                return Response(
                    {"error": "Raport nie istnieje."},
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
                    return Response({"error": "Musisz być członkiem wydawnictwa, aby utworzyć raport."}, status=status.HTTP_403_FORBIDDEN)

                if Raport.objects.filter(publisher_id=publisher.id, author=user).exists():
                    return Response({"error": "Możesz opublikować tylko jeden raport dla każdego wydawnictwa."}, status=status.HTTP_400_BAD_REQUEST)
                
                if publisher.due_date and publisher.due_date < timezone.now().date():
                    return Response(
                        {"error": "Nie można utworzyć raportu. Termin wydawcy minął."},
                        status=status.HTTP_400_BAD_REQUEST
                    )

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
    
    class DownloadRaportFileView(APIView):
        permission_classes = [IsAuthenticated]

        def get(self, request, pk):
            try:
                raport = Raport.objects.get(id=pk)
                user = request.user
                
                if not (user.is_staff or user == raport.author or user in raport.reviewers.all()):
                    return Response({"error": "Nie masz uprawnień do pobrania tego raportu."}, status=status.HTTP_403_FORBIDDEN)

                if not raport.file:
                    return Response({"error": "Brak pliku powiązanego z tym raportem."}, status=status.HTTP_404_NOT_FOUND)

                response = FileResponse(raport.file.open(), as_attachment=True, filename=raport.file.name)
                return response

            except Raport.DoesNotExist:
                return Response({"error": "Raport nie znaleziony."}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    class UpdateReviewInviteView(APIView):
        permission_classes = [IsAuthenticated]

        def post(self, request, pk):
            user = request.user

            try:
                review = RaportReview.objects.get(id=pk)

                if review.reviewer != user:
                    return Response(
                        {"error": "Nie masz uprawnień do aktualizacji tego zaproszenia do recenzji."},
                        status=status.HTTP_403_FORBIDDEN
                    )
                if review.status != RaportReview.RaportReviewStatus.INVITE_SENT:
                    return Response(
                        {"error": "Tego zaproszenia do recenzji nie można zaktualizować."},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                accept = request.data.get('accept')
                if accept is None:
                    return Response(
                        {"error": "Pole accept jest wymagane."},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                review.status = RaportReview.RaportReviewStatus.PENDING if accept else RaportReview.RaportReviewStatus.INVITE_REJECTED
                review.save()

                return Response(
                    {"message": "Status zaproszenia do recenzji zaktualizowany pomyślnie."},
                    status=status.HTTP_200_OK
                )

            except ObjectDoesNotExist:
                return Response(
                    {"error": "Recenzja nie istnieje."},
                    status=status.HTTP_404_NOT_FOUND
                )
            except Exception as e:
                return Response(
                    {"error": str(e)},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
    
    class PublisherRaportsView(APIView):
        serializer_class = PublisherRaportsSerializer
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
                user_reviews = RaportReview.objects.filter(raport__publisher__id=publisher_id, reviewer=user)

                authored_serializer = self.serializer_class(authored_raports, many=True)
                review_serializer = RaportReviewReviewerSerializer(user_reviews, many=True)

                return Response({
                    "authored_raports": authored_serializer.data,
                    "user_reviews": review_serializer.data
                })
    
    class PublishersView(generics.ListAPIView):
        serializer_class = PublisherSerializer
        permission_classes = [IsAuthenticated]

        def get_queryset(self):
            user = self.request.user
            if user.is_staff:
                return Publisher.objects.all().order_by('-created_at')
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
                    {"error": "Wydawnictwo nie istnieje lub nie jesteś jego członkiem"},
                    status.HTTP_404_NOT_FOUND
                    )
            except Exception as e:
                return Response(
                    {"error": str(e)},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
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
                        {"error": "Jesteś już członkiem tego wydawnictwa."},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                membership = PublisherMembership(user_id=user.id, publisher_id=publisher.id)
                membership.save()
                    
            except KeyError as e:
                return Response(
                    {"error": f"join_code musi być podane ({str(e)})"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )
            except ObjectDoesNotExist:
                return Response(
                    {"error": "nieprawidłowy kod dołączenia"},
                    status=status.HTTP_404_NOT_FOUND
                    )
            except Exception as e:
                return Response(
                    {"error": str(e)},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
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
                    return Response({"message": "Recenzja utworzona pomyślnie"}, status=status.HTTP_201_CREATED)
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
            # refresh_token_new = response_data.get('refresh') 
            
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
            
            # response.set_cookie(
            #     key='refreshToken',
            #     value=refresh_token_new,
            #     expires=now + refresh_lifetime,
            #     secure=True,
            #     httponly=True,
            #     samesite='None'
            # )

            response.data.pop('access', None)
            # response.data.pop('refresh', None)

            return response

    class UserIsStaffView(APIView):
        permission_classes = [IsAuthenticated]

        def get(self, request):
            user = request.user
            return Response({"is_staff": user.is_staff})
        

    class LogoutView(APIView):
        permission_classes = [IsAuthenticated]

        def post(self, request):
            refresh_token = request.COOKIES.get('refreshToken')
        
            if not refresh_token:
                return Response({"detail": "Nie znaleziono tokenu odświeżania w ciasteczkach."}, status=status.HTTP_400_BAD_REQUEST)
                
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
                
                response = Response({"detail": "Wylogowano pomyślnie."}, status=status.HTTP_200_OK)
                response.delete_cookie('accessToken')
                response.delete_cookie('refreshToken')

                return response
                
            except TokenError:
                return Response(
                    {"detail": "Token jest nieprawidłowy lub wygasł."},
                    status=status.HTTP_400_BAD_REQUEST
                )