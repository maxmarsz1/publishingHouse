from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
from rest_framework import serializers
from .models import Raport, RaportReview
from users.serializers import UserSerializer
from users.models import User


class RaportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Raport
        fields = ['id', 'title', 'author', 'publisher', 'abstract', 'reviewers', 'created_at', 'status', 'comment']
        
        
class PublisherRaportsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Raport
        fields = ['id', 'title', 'status']
        order = ['-created_at']

class NewOrUpdateRaportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Raport
        fields = ['title', 'abstract', 'raport_type', 'category', 'keywords', 'file', 'comment', 'publisher']
        extra_kwargs = {
            'publisher': {'read_only': True}
        }

class RaportListSerializer(serializers.ModelSerializer):
    publisher = serializers.SerializerMethodField()

    class Meta:
        model = Raport
        fields = ['id', 'title', 'author', 'publisher', 'status', 'created_at']
        ordering = ['-author.last_name', '-author.first_name', '-created_at']

    def get_publisher(self, obj):
        return {
            "id": obj.publisher.id,
            "name": obj.publisher.name
        } if obj.publisher else None

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
        fields = ['id', 'raport', 'reviewer', 'comment', 'status', 'review_date', 'grade', 
                  'content_consistency', 'goal_formulation', 'structure_correctness', 
                  'terminology_relevance', 'graphic_design', 'aesthetics', 
                  'literature_selection', 'conclusions_correctness', 'goal_achievement', 
                  'language_correctness']

class RaportReviewReviewerSerializer(serializers.ModelSerializer):
    raport = serializers.SerializerMethodField()

    class Meta:
        model = RaportReview
        fields = ['id', 'raport', 'status']
        
    def get_raport(self, obj):
        return {
            "id": obj.raport.id,
            "title": obj.raport.title
        } if obj.raport else None

class AuthorRaportSerializer(serializers.ModelSerializer):
    '''Used for author RaportView'''
    reviews = AnonymizedReviewSerializer(source='raport_reviews', many=True)
    publisher = serializers.SerializerMethodField()

    class Meta:
        model = Raport
        fields = ['id', 'title', 'abstract', 'status', 'created_at', 'category', 'raport_type', 'keywords', 'file', 'reviews', 'publisher', 'comment']

    def get_publisher(self, obj):
        return {
            "id": obj.publisher.id,
            "name": obj.publisher.name
        } if obj.publisher else None


class ReviewerRaportSerializer(serializers.ModelSerializer):
    '''Used for reviewer RaportView'''
    to_review = serializers.SerializerMethodField()
    publisher = serializers.SerializerMethodField()
    review = serializers.SerializerMethodField()

    class Meta:
        model = Raport
        fields = ['id', 'title', 'abstract', 'status', 'created_at', 'category', 'raport_type', 'keywords', 'file', 'to_review', 'publisher', 'comment', 'review']
    
    def get_to_review(self, obj):
        # Logic to determine if the raport is "to review" for the current user
        request = self.context.get('request')
        if request and request.user in obj.reviewers.all():
            return True
        return False

    def get_publisher(self, obj):
        return {
            "id": obj.publisher.id,
            "name": obj.publisher.name
        } if obj.publisher else None

    def get_review(self, obj):
        # Logic to fetch the review of the current user for this raport
        request = self.context.get('request')
        if request:
            review = obj.raport_reviews.filter(reviewer=request.user).first()
            if review:
                return {
                    "id": review.id,
                    "comment": review.comment,
                    "grade": review.grade,
                    "status": review.status,
                    "review_date": review.review_date
                }
        return None


class AdminRaportSerializer(serializers.ModelSerializer):
    '''Used for admin RaportView'''
    reviews = RaportReviewSerializer(source='raport_reviews', many=True)
    author = UserSerializer()
    publisher = serializers.SerializerMethodField()

    class Meta:
        model = Raport
        fields = ['id', 'title', 'author', 'abstract', 'status', 'created_at', 'category', 'raport_type', 'keywords', 'file', 'reviews', 'publisher', 'comment']

    def get_publisher(self, obj):
        return {
            "id": obj.publisher.id,
            "name": obj.publisher.name
        } if obj.publisher else None
    

class CreateReviewSerializer(serializers.ModelSerializer):
    raport_id = serializers.IntegerField(write_only=True)
    comment = serializers.CharField(required=True)

    class Meta:
        model = RaportReview
        fields = ['raport_id', 'comment', 'content_consistency', 'goal_formulation', 
                  'structure_correctness', 'terminology_relevance', 'graphic_design', 
                  'aesthetics', 'literature_selection', 'conclusions_correctness', 
                  'goal_achievement', 'language_correctness']
        extra_kwargs = {
            'content_consistency': {'required': True, 'allow_null': False},
            'goal_formulation': {'required': True, 'allow_null': False},
            'structure_correctness': {'required': True, 'allow_null': False},
            'terminology_relevance': {'required': True, 'allow_null': False},
            'graphic_design': {'required': True, 'allow_null': False},
            'aesthetics': {'required': True, 'allow_null': False},
            'literature_selection': {'required': True, 'allow_null': False},
            'conclusions_correctness': {'required': True, 'allow_null': False},
            'goal_achievement': {'required': True, 'allow_null': False},
            'language_correctness': {'required': True, 'allow_null': False},
        }

    def validate_comment(self, value):
        word_count = len(value.split())
        if word_count < 100 or word_count > 1000:
            raise serializers.ValidationError(f"Comment must be between 100 and 1000 words. Currently: {word_count} words.")
        return value

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
        
        review.content_consistency = validated_data.get('content_consistency')
        review.goal_formulation = validated_data.get('goal_formulation')
        review.structure_correctness = validated_data.get('structure_correctness')
        review.terminology_relevance = validated_data.get('terminology_relevance')
        review.graphic_design = validated_data.get('graphic_design')
        review.aesthetics = validated_data.get('aesthetics')
        review.literature_selection = validated_data.get('literature_selection')
        review.conclusions_correctness = validated_data.get('conclusions_correctness')
        review.goal_achievement = validated_data.get('goal_achievement')
        review.language_correctness = validated_data.get('language_correctness')
        
        review.review_date = timezone.now()
        review.status = "submitted"
        review.save()

        return review