from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RaportViewSet, RaportReviewViewSet, UserViewSet, PublisherViewSet

router = DefaultRouter()
router.register(r'raports', RaportViewSet)
router.register(r'raportreviews', RaportReviewViewSet)
router.register(r'users', UserViewSet)
router.register(r'publishers', PublisherViewSet)

urlpatterns = [
    path("", include(router.urls))
]
