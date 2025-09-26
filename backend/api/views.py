from rest_framework import viewsets, status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser


from raports.models import Raport, RaportReview
from users.models import User
from publishers.models import Publisher, PublisherMembership

from raports.serializers import RaportSerializer, RaportReviewSerializer
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
        
    
class UserAuthoredRaportsView(generics.ListAPIView):
    serializer_class = RaportSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Raport.objects.filter(author=user)
    
class UserReviewRaportsView(generics.ListAPIView):
    serializer_class = RaportSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Raport.objects.filter(reviewers=user)
    
class UserRaportsView(APIView):
    serializer_class = RaportSerializer
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
    
    
class UserRegistrationView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(APIView):
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
    
    
class UserPublishersView(generics.ListAPIView):
    serializer_class = PublisherSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Publisher.objects.filter(members=user)