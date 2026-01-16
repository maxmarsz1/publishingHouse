import os
from django.core.management.base import BaseCommand
from users.models import User

class Command(BaseCommand):
    help = 'Creates initial users with specified passwords.'

    def handle(self, *args, **options):
        admin_username = os.environ.get('DJANGO_SUPERUSER_USERNAME', 'admin')
        admin_email = os.environ.get('DJANGO_SUPERUSER_EMAIL', 'admin@example.com')
        admin_password = os.environ.get('DJANGO_SUPERUSER_PASSWORD', 'adminPassword')

        admin, created = User.objects.get_or_create(username=admin_username, defaults={'email': admin_email})
        admin.set_password(admin_password)
        admin.is_superuser = True
        admin.is_staff = True
        admin.save()
        if created:
            self.stdout.write(self.style.SUCCESS(f'Successfully created superuser "{admin_username}".'))
        else:
            self.stdout.write(self.style.SUCCESS(f'Successfully updated superuser "{admin_username}".'))