from rest_framework.test import APITestCase, APIRequestFactory, force_authenticate
from rest_framework import status
from users.models import User
from magazines.models import Magazine
from papers.models import Paper, PaperReview
from magazines.views import DistributeReviewsView

class DistributeReviewsTest(APITestCase):
    def setUp(self):
        self.magazine = Magazine.objects.create(name="Test Mag")
        self.admin = User.objects.create_superuser('admin', 'admin@example.com', 'password')
        self.u1 = User.objects.create_user('u1', 'u1@example.com', 'password')
        self.u2 = User.objects.create_user('u2', 'u2@example.com', 'password')
        
        # Papers
        # Note: NOT adding users to magazine members to verify check removal
        self.p1 = Paper.objects.create(
            title="P1", 
            author=self.u1, 
            magazine=self.magazine, 
            status=Paper.PaperStatus.PENDING, 
            abstract="test", 
            file="test.pdf"
        )
        self.p2 = Paper.objects.create(
            title="P2", 
            author=self.u2, 
            magazine=self.magazine, 
            status=Paper.PaperStatus.PENDING, 
            abstract="test", 
            file="test.pdf"
        )
        
    def test_distribute_reviews(self):
        factory = APIRequestFactory()
        view = DistributeReviewsView.as_view()
        
        request = factory.post(f'/magazines/{self.magazine.id}/distribute_reviews/')
        force_authenticate(request, user=self.admin)
        response = view(request, pk=self.magazine.id)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # With 2 participants, each should review the other -> 2 reviews total
        self.assertEqual(PaperReview.objects.count(), 2)
        
        # Verify reviews
        r1 = PaperReview.objects.get(reviewer=self.u1)
        self.assertEqual(r1.paper, self.p2)
        
        r2 = PaperReview.objects.get(reviewer=self.u2)
        self.assertEqual(r2.paper, self.p1)
