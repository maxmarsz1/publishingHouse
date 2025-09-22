from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import(
 TokenObtainPairView, TokenRefreshView)

from .views import RaportViewSet, RaportReviewViewSet, UserViewSet, PublisherViewSet

router = DefaultRouter()
router.register(r'raports', RaportViewSet)
router.register(r'raportreviews', RaportReviewViewSet)
router.register(r'users', UserViewSet)
router.register(r'publishers', PublisherViewSet)

urlpatterns = [
    path("", include(router.urls)),
    
    path('token/', TokenObtainPairView.as_view(),
          name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(),
          name='token_refresh'),
]
