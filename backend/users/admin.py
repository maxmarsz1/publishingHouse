from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'is_staff')

    def get_fieldsets(self, request, obj=None):
        if not obj:
            return super().get_fieldsets(request, obj)

        return (
            (None, {'fields': ('username', 'password', 'email')}),
            ('Personal info', {'fields': ('first_name', 'last_name')}),
            ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
            ('Important dates', {'fields': ('date_joined',)}),
        )

admin.site.register(User, UserAdmin)