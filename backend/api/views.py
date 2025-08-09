from rest_framework import viewsets


from raports.models import Raport, RaportReview
from users.models import User
from publishers.models import Publisher

from raports.serializers import RaportSerializer, RaportReviewSerializer
from users.serializers import UserSerializer
from publishers.serializers import PublisherSerializer


class RaportViewSet(viewsets.ModelViewSet):
    queryset = Raport.objects.all()
    serializer_class = RaportSerializer
    
class RaportReviewViewSet(viewsets.ModelViewSet):
    queryset = RaportReview.objects.all()
    serializer_class = RaportReviewSerializer
    
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
class PublisherViewSet(viewsets.ModelViewSet):
    queryset = Publisher.objects.all()
    serializer_class = PublisherSerializer