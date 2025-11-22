from django.core.management.base import BaseCommand
from users.models import User

class Command(BaseCommand):
    help = 'Creates initial users with specified passwords.'

    def handle(self, *args, **options):
        admin, created = User.objects.get_or_create(username='admin', defaults={'email': 'admin@example.com'})
        admin.set_password('adminPassword')
        admin.is_superuser = True
        admin.is_staff = True
        admin.save()
        self.stdout.write(self.style.SUCCESS('Successfully ensured admin user exists.'))

        john, created = User.objects.get_or_create(username='johnsmith', defaults={'email': 'john.smith@example.com'})
        
        john.set_password('johnPassword')
        john.save()
        self.stdout.write(self.style.SUCCESS('Successfully ensured johnsmith user exists.'))