from rest_framework import viewsets, status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.core.exceptions import ObjectDoesNotExist
import random

from magazines.models import Magazine, MagazineMembership
from users.models import User
from papers.models import Paper, PaperReview
from magazines.serializers import MagazineSerializer, MagazineMembershipSerializer
from users.serializers import UserSerializer
from papers.serializers import AdminPaperSerializer, PaperReviewReviewerSerializer, AuthorPaperSerializer, MagazinePapersSerializer

class MagazineViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminUser]
    queryset = Magazine.objects.all()
    serializer_class = MagazineSerializer
    
class MagazineMembershipViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminUser]
    queryset = MagazineMembership.objects.all()
    serializer_class = MagazineMembershipSerializer

class DeleteMemberView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        magazine_id = self.kwargs['magazine_id']
        user_id = self.kwargs['user_id']

        try:
            user = User.objects.get(id=user_id)
            membership = MagazineMembership.objects.get(user_id=user_id, magazine_id=magazine_id)
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
            {"message": f"Użytkownik {user.username} został usunięty z magazynu."}, 
            status=status.HTTP_200_OK
        )
        
class AcceptAllReviewsView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            magazine = Magazine.objects.get(id=pk)
            
            if not request.user.is_staff and not magazine.members.filter(id=request.user.id).exists():
                    return Response({"error": "Brak uprawnień."}, status=status.HTTP_403_FORBIDDEN)

            papers = Paper.objects.filter(magazine=magazine)
            reviews = PaperReview.objects.filter(
                paper__in=papers,
                status=PaperReview.PaperReviewStatus.SUBMITTED
            )
            
            count = reviews.count()
            if count == 0:
                    return Response({"message": "Brak recenzji do zatwierdzenia."}, status=status.HTTP_200_OK)

            reviews.update(status=PaperReview.PaperReviewStatus.APPROVED)
            
            return Response(
                {"message": f"Zatwierdzono {count} recenzji."}, 
                status=status.HTTP_200_OK
            )
        except Magazine.DoesNotExist:
                return Response({"error": "Magazyn nie istnieje."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ListMembersView(APIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        magazine_id = self.kwargs['pk']

        try:
            memberships = MagazineMembership.objects.filter(magazine_id=magazine_id)
            user_ids = memberships.values_list('user_id', flat=True)
            members = User.objects.filter(id__in=user_ids)
            members_serializer = self.serializer_class(members, many=True)
        except Exception as e:
            return Response(
                {"error": "Nie udało się pobrać członków."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        return Response(members_serializer.data, status=status.HTTP_200_OK)
    
class GenerateMagazineJoinCode(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        magazine_id = self.kwargs['pk']

        try:
            magazine = Magazine.objects.get(id=magazine_id)
            new_join_code = Magazine.generate_join_code()
            magazine.join_code = new_join_code
            magazine.save()
        except ObjectDoesNotExist:
            return Response(
                {"error": "Magazyn nie istnieje."}, 
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
        magazine_id = pk
        try:
            magazine = Magazine.objects.get(id=magazine_id)
            
            pending_papers = list(Paper.objects.filter(magazine=magazine, status=Paper.PaperStatus.PENDING).select_related('author'))
            
            memberships = MagazineMembership.objects.filter(magazine=magazine)
            member_user_ids = memberships.values_list('user', flat=True)
            members = list(User.objects.filter(id__in=member_user_ids))
            
            invites_sent_count = 0
            
            pairs = []
            used_papers = set()
            
            for member in members:
                # Find a pending paper by this member
                member_papers = [
                    p for p in pending_papers 
                    if p.author_id == member.id 
                    and p.id not in used_papers 
                    and not p.reviews.exists()
                ]
                if member_papers:
                    pairs.append({'member': member, 'paper': member_papers[0]})
                    used_papers.add(member_papers[0].id)
            
            n = len(pairs)
            if n < 2:
                    if n == 0:
                        return Response({"message": "Brak użytkowników do rozdziału."}, status=status.HTTP_200_OK)
                    else:
                        return Response({"message": f"Zbyt mało uczestników do rozdziału recenzji."}, status=status.HTTP_200_OK)
            
            random.shuffle(pairs)
            
            for i in range(n):
                reviewer = pairs[i]['member']
                
                idx1 = (i + 1) % n
                idx2 = (i + 2) % n
                
                targets = []
                if pairs[idx1]['member'].id != reviewer.id:
                    targets.append(pairs[idx1]['paper'])
                
                if pairs[idx2]['member'].id != reviewer.id and idx2 != idx1:
                    targets.append(pairs[idx2]['paper'])

                for paper in targets:
                    if not PaperReview.objects.filter(paper=paper, reviewer=reviewer).exists():
                        PaperReview.objects.create(
                            paper=paper,
                            reviewer=reviewer,
                            status=PaperReview.PaperReviewStatus.INVITE_SENT
                        )
                        invites_sent_count += 1

            return Response({"message": f"Rozdzielono recenzje. Wysłano {invites_sent_count} zaproszeń dla {n} uczestników."}, status=status.HTTP_200_OK)

        except Magazine.DoesNotExist:
                return Response({"error": "Magazyn nie istnieje."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class MagazinePapersView(APIView):
    serializer_class = MagazinePapersSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        magazine_id = self.kwargs['pk']
        user = self.request.user

        if user.is_staff:
            papers = Paper.objects.filter(magazine__id=magazine_id)
            serializer = AdminPaperSerializer(papers, many=True)
            return Response({"all_papers": serializer.data})
        else:
            authored_papers = Paper.objects.filter(magazine__id=magazine_id, author=user)
            user_reviews = PaperReview.objects.filter(paper__magazine__id=magazine_id, reviewer=user)

            authored_serializer = self.serializer_class(authored_papers, many=True)
            review_serializer = PaperReviewReviewerSerializer(user_reviews, many=True)

            return Response({
                "authored_papers": authored_serializer.data,
                "user_reviews": review_serializer.data
            })

class MagazinesView(generics.ListAPIView):
    serializer_class = MagazineSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Magazine.objects.all().order_by('-created_at')
        return Magazine.objects.filter(members=user)
    
class MagazineDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        user = request.user

        try:
            if user.is_staff:
                magazine = Magazine.objects.get(id=pk)
            else:
                membership = MagazineMembership.objects.get(user_id=user.id, magazine_id=pk)
                magazine = Magazine.objects.get(id=membership.magazine_id)
            magazine_serializer = MagazineSerializer(magazine)

        except ObjectDoesNotExist:
            return Response(
                {"error": "Magazyn nie istnieje lub nie jesteś jego członkiem"},
                status=status.HTTP_404_NOT_FOUND
                )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        return Response(magazine_serializer.data)

class JoinMagazineView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        try:
            join_code = request.data['join_code']
            magazine = Magazine.objects.get(join_code=join_code)
            
            if MagazineMembership.objects.filter(user_id=user.id, magazine_id=magazine.id).exists():
                return Response(
                    {"error": "Jesteś już członkiem tego magazynu."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            membership = MagazineMembership(user_id=user.id, magazine_id=magazine.id)
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
            MagazineSerializer(magazine).data
        )
