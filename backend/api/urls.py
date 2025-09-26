from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import(
 TokenObtainPairView, TokenRefreshView, TokenVerifyView)

from .views import AdminViews, UserRegistrationView, UserProfileView, UserRaportsView, UserReviewRaportsView, UserPublishersView, PublisherRaportsView

router = DefaultRouter()
router.register(r'raports', AdminViews.RaportViewSet)
router.register(r'raportreviews', AdminViews.RaportReviewViewSet)
router.register(r'users', AdminViews.UserViewSet)
router.register(r'publishers', AdminViews.PublisherViewSet)
router.register(r'publishermemberships', AdminViews.PublisherMembershipViewSet)

urlpatterns = [
    path("", include(router.urls)),
    
    path('publisher/<int:pk>/raports/', PublisherRaportsView.as_view(), name='publisher-raports'),
    path('user/publishers/', UserPublishersView.as_view(), name='user-publishers'),
    path('user/raports/', UserRaportsView.as_view(), name='user-raports'),
    path('user/review-raports/', UserReviewRaportsView.as_view(), name='user-review-raports'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
