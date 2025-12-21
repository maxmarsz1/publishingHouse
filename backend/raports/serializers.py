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

    def validate_abstract(self, value):
        from .models import AppSettings
        try:
            settings = AppSettings.load()
            min_words = settings.abstract_min_words
            max_words = settings.abstract_max_words
        except:
             # Fallback if DB not ready or migration issue
            min_words = 150
            max_words = 250
            
        word_count = len(value.split())
        if word_count < min_words or word_count > max_words:
            raise serializers.ValidationError(f"Abstrakt musi mieć od {min_words} do {max_words} słów.")
        return value

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

class AnonymizedDetailedReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = RaportReview
        fields = ['id', 'grade', 'custom_grade', 'review_date', 'status', 'comment', 'decision',
                  'content_consistency', 'goal_formulation', 'structure_correctness',
                  'terminology_relevance', 'graphic_design', 'aesthetics',
                  'literature_selection', 'conclusions_correctness', 'goal_achievement',
                  'language_correctness', 'is_admin_review']
    
    is_admin_review = serializers.SerializerMethodField()

    def get_is_admin_review(self, obj):
        return obj.reviewer.is_staff

class ReviewerSerializer(serializers.ModelSerializer):
    class Meta:
        model = User  
        fields = ['id', 'username', 'first_name', 'last_name'] 

class RaportReviewSerializer(serializers.ModelSerializer):
    reviewer = ReviewerSerializer()
    
    class Meta:
        model = RaportReview
        fields = ['id', 'raport', 'reviewer', 'comment', 'status', 'review_date', 'grade', 'custom_grade', 'decision',
                  'content_consistency', 'goal_formulation', 'structure_correctness', 
                  'terminology_relevance', 'graphic_design', 'aesthetics', 
                  'literature_selection', 'conclusions_correctness', 'goal_achievement', 
                  'language_correctness', 'is_admin_review']
    
    is_admin_review = serializers.SerializerMethodField()

    def get_is_admin_review(self, obj):
        return obj.reviewer.is_staff

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
    reviews = serializers.SerializerMethodField()
    publisher = serializers.SerializerMethodField()

    class Meta:
        model = Raport
        fields = ['id', 'title', 'abstract', 'status', 'created_at', 'category', 'raport_type', 'keywords', 'file', 'reviews', 'publisher', 'comment']

    def get_reviews(self, obj):
        reviews = obj.raport_reviews.filter(status=RaportReview.RaportReviewStatus.APPROVED)
        return AnonymizedDetailedReviewSerializer(reviews, many=True).data

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
        fields = ['id', 'title', 'abstract', 'created_at', 'category', 'raport_type', 'keywords', 'file', 'to_review', 'publisher', 'review']
    
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
                return AnonymizedDetailedReviewSerializer(review).data
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
    comment = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = RaportReview
        fields = ['raport_id', 'comment', 'decision', 'grade', 'custom_grade', 'content_consistency', 'goal_formulation', 
                  'structure_correctness', 'terminology_relevance', 'graphic_design', 
                  'aesthetics', 'literature_selection', 'conclusions_correctness', 
                  'goal_achievement', 'language_correctness']
        extra_kwargs = {
            'content_consistency': {'required': False, 'allow_null': True},
            'goal_formulation': {'required': False, 'allow_null': True},
            'structure_correctness': {'required': False, 'allow_null': True},
            'terminology_relevance': {'required': False, 'allow_null': True},
            'graphic_design': {'required': False, 'allow_null': True},
            'aesthetics': {'required': False, 'allow_null': True},
            'literature_selection': {'required': False, 'allow_null': True},
            'conclusions_correctness': {'required': False, 'allow_null': True},
            'goal_achievement': {'required': False, 'allow_null': True},
            'language_correctness': {'required': False, 'allow_null': True},
            'decision': {'required': True, 'allow_null': False},
        }

    def validate_comment(self, value):
        request = self.context.get('request')
        user = request.user
        
        # Admin can have empty or short comments
        if user.is_staff:
            return value

        from .models import AppSettings
        try:
            settings = AppSettings.load()
            min_words = settings.review_min_words
            max_words = settings.review_max_words
        except:
            min_words = 100
            max_words = 1000

        word_count = len(value.split())
        if word_count < min_words or word_count > max_words:
            raise serializers.ValidationError(f"Komentarz musi mieć od {min_words} do {max_words} słów.")
        return value

    def validate(self, data):
        request = self.context.get('request')
        user = request.user
        raport_id = data.get('raport_id')

        # For non-admin, enforce criteria are present
        if not user.is_staff:
            required_criteria = [
                'content_consistency', 'goal_formulation', 'structure_correctness',
                'terminology_relevance', 'graphic_design', 'aesthetics',
                'literature_selection', 'conclusions_correctness',
                'goal_achievement', 'language_correctness'
            ]
            errors = {}
            for field in required_criteria:
                if data.get(field) is None:
                    errors[field] = "To pole jest wymagane."
            if errors:
                raise serializers.ValidationError(errors)

        try:
            raport = Raport.objects.get(id=raport_id)
        except Raport.DoesNotExist:
            raise serializers.ValidationError({"raport_id": "Raport nie istnieje"})

        if not user.is_staff and user not in raport.reviewers.all():
            raise serializers.ValidationError({"error": "Użytkownik nie jest recenzentem tego raportu"})

        if raport.status in [Raport.RaportStatus.APPROVED, Raport.RaportStatus.PUBLISHED, Raport.RaportStatus.REJECTED]:
            raise serializers.ValidationError({"error": "Nie można dodać recenzji do zatwierdzonych, odrzuconych lub opublikowanych raportów"})

        return data

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user
        raport_id = validated_data.pop('raport_id')
        raport = Raport.objects.get(id=raport_id)

        review, created = RaportReview.objects.get_or_create(raport=raport, reviewer=user)
        review.comment = validated_data.get('comment')
        review.decision = validated_data.get('decision')
        
        if user.is_staff and 'custom_grade' in validated_data:
             review.custom_grade = validated_data.get('custom_grade')

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
        if user.is_staff:
            review.status = "approved"

        review.save()

        if user.is_staff and review.decision:
            if review.decision == RaportReview.ReviewDecision.ACCEPT:
                raport.status = Raport.RaportStatus.APPROVED
            elif review.decision == RaportReview.ReviewDecision.REJECT:
                raport.status = Raport.RaportStatus.REJECTED
            elif review.decision in [RaportReview.ReviewDecision.MINOR_REVISION, RaportReview.ReviewDecision.MAJOR_REVISION]:
                raport.status = Raport.RaportStatus.WAITING_FOR_REVISION
            raport.save()


        return review