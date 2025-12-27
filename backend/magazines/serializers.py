from rest_framework import serializers
from .models import Magazine, MagazineMembership

class MagazineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Magazine
        fields = ['id', 'name', 'description', 'due_date', 'join_code']
        

class MagazineMembershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = MagazineMembership
        fields = ['id', 'user', 'magazine', 'role', 'date_joined']