from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import(
 TokenObtainPairView, TokenRefreshView, TokenVerifyView)

from .views import AdminViews, UserViews

router = DefaultRouter()
router.register(r'raports', AdminViews.RaportViewSet)
router.register(r'raportreviews', AdminViews.RaportReviewViewSet)
router.register(r'users', AdminViews.UserViewSet)
router.register(r'publishers', AdminViews.PublisherViewSet)
router.register(r'publishermemberships', AdminViews.PublisherMembershipViewSet)

urlpatterns = [
    path("", include(router.urls)),
    
    path("publisher/<int:pk>/members/", AdminViews.ListMembersView.as_view(), name='list-members'),
    path("publisher/<int:publisher_id>/members/<int:user_id>/", AdminViews.DeleteMemberView.as_view(), name="delete-member"),
    path("publisher/<int:pk>/generate-join-code/", AdminViews.GeneratePublisherJoinCode.as_view(), name="generate-join-code"),
    
    path("publisher/join/", UserViews.JoinPublisherView.as_view(), name='join-publisher'),
    path('publisher/<int:pk>/', UserViews.PublisherDetailView.as_view(), name='publisher-detail'),
    path('publisher/<int:pk>/raports/', UserViews.PublisherRaportsView.as_view(), name='publisher-raports'),
    path('publisher/<int:pk>/create-raport/', UserViews.CreateRaportView.as_view(), name='create-raport'),
    path('user/publishers/', UserViews.PublishersView.as_view(), name='user-publishers'),
    path('user/raports/', UserViews.RaportsView.as_view(), name='user-raports'),
    path('user/change-password/', UserViews.ChangePasswordView.as_view(), name='change-password'),
    path('raport/<int:pk>/', UserViews.RaportView.as_view(), name='raport-view'),
    path('raport/<int:pk>/create-review/', UserViews.CreateReviewView.as_view(), name='create-review'),
    path('profile/', UserViews.ProfileView.as_view(), name='profile'),

    path('register/', UserViews.RegistrationView.as_view(), name='register'),
    path('login/', UserViews.CustomTokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', UserViews.LogoutView.as_view(), name='logout'),
]
