from django.db import models
import random, string

from users.models import User

class Magazine(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    join_code = models.CharField(max_length=10, unique=True, blank=True, null=True) 
    due_date = models.DateTimeField(blank=True, null=True)
    members = models.ManyToManyField(
        User,
        through='MagazineMembership',
        related_name='magazines',
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.pk:
            if not self.join_code:
                self.join_code = self.generate_join_code(length=8)
        
        super().save(*args, **kwargs)
        
    @staticmethod
    def generate_join_code(length=8):
        characters = string.ascii_uppercase + string.digits
        while True:
            code = ''.join(random.choice(characters) for _ in range(length))
            if not Magazine.objects.filter(join_code=code).exists():
                return code


class MagazineMembership(models.Model):
    class MemberRole(models.TextChoices):
        MEMBER = "member", "Member"
        ADMIN = "admin", "Admin"


    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='magazine_memberships')
    magazine = models.ForeignKey(Magazine, on_delete=models.CASCADE, related_name='memberships')
    role = models.CharField(max_length=50, choices=MemberRole.choices, default=MemberRole.MEMBER)
    date_joined = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'magazine')
        verbose_name = "Magazine Membership"
        verbose_name_plural = "Magazine Memberships"

    def __str__(self):
        return f"{self.user.username} - {self.magazine.name} ({self.role})"