from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
from rest_framework import serializers
from .models import Raport, RaportReview
from users.serializers import UserSerializer
from users.models import User


class RaportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Raport
        fields = ['id', 'title', 'author', 'publisher', 'abstract', 'reviewers', 'created_at', 'status']
        
class NewRaportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Raport
        fields = ['title', 'abstract', 'raport_type', 'category', 'keywords', 'file', 'comment', 'publisher']
        extra_kwargs = {
            'publisher': {'read_only': True}
        }

class RaportListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Raport
        fields = ['id', 'title', 'author', 'publisher', 'status', 'created_at']
        ordering = ['-author.last_name', '-author.first_name', '-created_at']

class AnonymizedReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = RaportReview
        fields = ['id', 'grade', 'review_date', 'status']
        
class ReviewerSerializer(serializers.ModelSerializer):
    class Meta:
        model = User  
        fields = ['id', 'username', 'first_name', 'last_name'] 

class RaportReviewSerializer(serializers.ModelSerializer):
    reviewer = ReviewerSerializer()
    
    class Meta:
        model = RaportReview
        fields = ['id', 'raport', 'reviewer', 'comment', 'status', 'review_date', 'grade']


class AuthorRaportSerializer(serializers.ModelSerializer):
    '''Used for author RaportView'''
    reviews = AnonymizedReviewSerializer(source='raport_reviews', many=True)
    publisher = serializers.SerializerMethodField()

    class Meta:
        model = Raport
        fields = ['id', 'title', 'abstract', 'status', 'created_at', 'category', 'raport_type', 'keywords', 'file', 'reviews', 'publisher']

    def get_publisher(self, obj):
        return obj.publisher.name if obj.publisher else None


class ReviewerRaportSerializer(serializers.ModelSerializer):
    '''Used for reviewer RaportView'''
    to_review = serializers.SerializerMethodField()
    publisher = serializers.SerializerMethodField()

    class Meta:
        model = Raport
        fields = ['id', 'title', 'abstract', 'status', 'created_at', 'category', 'raport_type', 'keywords', 'file', 'to_review', 'publisher']
    
    def get_to_review(self, obj):
        # Logic to determine if the raport is "to review" for the current user
        request = self.context.get('request')
        if request and request.user in obj.reviewers.all():
            return True
        return False

    def get_publisher(self, obj):
        return obj.publisher.name if obj.publisher else None


class AdminRaportSerializer(serializers.ModelSerializer):
    '''Used for admin RaportView'''
    reviews = RaportReviewSerializer(source='raport_reviews', many=True)
    author = UserSerializer()
    publisher = serializers.SerializerMethodField()

    class Meta:
        model = Raport
        fields = ['id', 'title', 'author', 'abstract', 'status', 'created_at', 'category', 'raport_type', 'keywords', 'file', 'reviews', 'publisher']

    def get_publisher(self, obj):
        return obj.publisher.name if obj.publisher else None
    

class CreateReviewSerializer(serializers.ModelSerializer):
    raport_id = serializers.IntegerField(write_only=True)
    grade = serializers.FloatField(
        validators=[MinValueValidator(0.0), MaxValueValidator(5.0)]
    )
    comment = serializers.CharField(required=True)

    class Meta:
        model = RaportReview
        fields = ['raport_id', 'comment', 'grade']

    def validate(self, data):
        request = self.context.get('request')
        user = request.user
        raport_id = data.get('raport_id')

        try:
            raport = Raport.objects.get(id=raport_id)
        except Raport.DoesNotExist:
            raise serializers.ValidationError({"raport_id": "Raport does not exist"})

        if user not in raport.reviewers.all():
            raise serializers.ValidationError({"error": "User is not a reviewer for this raport"})

        if raport.status in [Raport.RaportStatus.APPROVED, Raport.RaportStatus.PUBLISHED, Raport.RaportStatus.REJECTED]:
            raise serializers.ValidationError({"error": "Reviews cannot be added to approved, rejected or published raports"})

        return data

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user
        raport_id = validated_data.pop('raport_id')
        raport = Raport.objects.get(id=raport_id)

        review, created = RaportReview.objects.get_or_create(raport=raport, reviewer=user)
        review.comment = validated_data.get('comment')
        review.grade = validated_data.get('grade')
        review.review_date = timezone.now()
        review.status = "submitted"
        review.save()

        return review