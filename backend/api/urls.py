from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import(
 TokenObtainPairView, TokenRefreshView, TokenVerifyView)
from django.conf.urls.static import static
from django.conf import settings

from users import views as user_views
from magazines import views as magazine_views
from papers import views as paper_views
from papers.views_settings import AppSettingsView

router = DefaultRouter()
router.register(r'papers', paper_views.PaperViewSet)
router.register(r'review', paper_views.PaperReviewViewSet)
router.register(r'users', user_views.UserViewSet)
router.register(r'magazines', magazine_views.MagazineViewSet)
router.register(r'magazinememberships', magazine_views.MagazineMembershipViewSet)

urlpatterns = [
    path("", include(router.urls)),
    
    path("magazine/<int:pk>/members/", magazine_views.ListMembersView.as_view(), name='list-members'),
    path("magazine/<int:magazine_id>/members/<int:user_id>/", magazine_views.DeleteMemberView.as_view(), name="delete-member"),
    path("magazine/<int:pk>/generate-join-code/", magazine_views.GenerateMagazineJoinCode.as_view(), name="generate-join-code"),
    path("magazine/<int:pk>/distribute-reviews/", magazine_views.DistributeReviewsView.as_view(), name="distribute-reviews"),
    path("magazine/<int:pk>/accept-all-reviews/", magazine_views.AcceptAllReviewsView.as_view(), name="accept-all-reviews"),
    
    path("magazine/join/", magazine_views.JoinMagazineView.as_view(), name='join-magazine'),
    path('magazine/<int:pk>/', magazine_views.MagazineDetailView.as_view(), name='magazine-detail'),
    path('magazine/<int:pk>/papers/', magazine_views.MagazinePapersView.as_view(), name='magazine-papers'),
    path('magazine/<int:pk>/create-paper/', paper_views.CreatePaperView.as_view(), name='create-paper'),
    
    path('user/magazines/', magazine_views.MagazinesView.as_view(), name='user-magazines'),
    path('user/papers/', paper_views.PapersView.as_view(), name='user-papers'),
    path('user/change-password/', user_views.ChangePasswordView.as_view(), name='change-password'),
    path('user/', user_views.ProfileView.as_view(), name='profile'),
    
    path('paper/<int:pk>/', paper_views.PaperDetailUpdateDeleteView.as_view(), name='paper-view'),
    path('paper/<int:pk>/create-review/', paper_views.CreateReviewView.as_view(), name='create-review'),
    path('paper/<int:pk>/review-invite-response/', paper_views.UpdateReviewInviteView.as_view(), name='invite-handling'),
    path('paper/<int:pk>/download/', paper_views.DownloadPaperFileView.as_view(), name='download-paper'),
    
    path('auth/is-staff/', user_views.UserIsStaffView.as_view(), name='is-staff'),
    path('auth/register/', user_views.RegistrationView.as_view(), name='register'),
    path('auth/login/', user_views.CustomTokenObtainPairView.as_view(), name='login'),
    path('auth/refresh/', user_views.CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('auth/logout/', user_views.LogoutView.as_view(), name='logout'),
    
    path('settings/', AppSettingsView.as_view(), name='app-settings'),
    path('paper/review/<int:pk>/pdf/', paper_views.ReviewPDFView.as_view(), name='review-pdf'),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)