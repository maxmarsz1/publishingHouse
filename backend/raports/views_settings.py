from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import AppSettings
from .serializers_settings import AppSettingsSerializer

class AppSettingsView(APIView):
    # Only authenticated users can view, only admin can edit?
    # Requirement: "add app settings page for admin"
    # Logic: Admins edit. Authors/Reviewers might need to read limits? 
    # Actually, validation will happen on backend too, but frontend helpful to know limits.
    # Let's say: Authenticated can GET, Admin can POST.

    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAdminUser()]
        return [IsAuthenticated()]

    def get(self, request):
        settings = AppSettings.load()
        serializer = AppSettingsSerializer(settings)
        return Response(serializer.data)

    def post(self, request):
        settings = AppSettings.load()
        serializer = AppSettingsSerializer(settings, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
