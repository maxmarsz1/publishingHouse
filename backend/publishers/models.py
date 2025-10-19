from django.db import models
import random, string

from users.models import User


def generate_unique_join_code(length=10):
    characters = string.ascii_uppercase + string.digits
    while True:
        code = ''.join(random.choice(characters) for _ in range(length))
        if not Publisher.objects.filter(join_code=code).exists():
            return code

class Publisher(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    join_code = models.CharField(max_length=10, unique=True, blank=True, null=True) 
    due_date = models.DateTimeField(blank=True, null=True)
    members = models.ManyToManyField(
        User,
        through='PublisherMembership',
        related_name='publishers',
        blank=True
    )

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.pk:
            if not self.join_code:
                self.join_code = generate_unique_join_code(length=8)
        
        super().save(*args, **kwargs)


class PublisherMembership(models.Model):
    class MemberRole(models.TextChoices):
        MEMBER = "member", "Member"
        ADMIN = "admin", "Admin"


    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='publisher_memberships')
    publisher = models.ForeignKey(Publisher, on_delete=models.CASCADE, related_name='memberships')
    role = models.CharField(max_length=50, choices=MemberRole.choices, default=MemberRole.MEMBER)
    date_joined = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'publisher')
        verbose_name = "Publisher Membership"
        verbose_name_plural = "Publisher Memberships"

    def __str__(self):
        return f"{self.user.username} - {self.publisher.name} ({self.role})"