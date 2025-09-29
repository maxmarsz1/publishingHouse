from rest_framework import serializers
from .models import Raport, RaportReview

class RaportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Raport
        fields = ['id', 'title', 'author', 'publisher', 'abstract', 'reviewers', 'created_at', 'status']
        

class RaportReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = RaportReview
        fields = ['id', 'raport', 'reviewer', 'comment', 'status', 'review_date', 'grade']
        