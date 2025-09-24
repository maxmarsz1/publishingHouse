from rest_framework import serializers
from .models import Publisher, PublisherMembership

class PublisherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publisher
        fields = ['id', 'name', 'description', 'members']
        

class PublisherMembershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = PublisherMembership
        fields = ['id', 'user', 'publisher', 'role', 'date_joined']