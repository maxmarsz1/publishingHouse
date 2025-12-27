from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
from rest_framework import serializers
from .models import Paper, PaperReview
from users.serializers import UserSerializer
from users.models import User


class PaperSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paper
        fields = ['id', 'title', 'author', 'magazine', 'abstract', 'reviewers', 'created_at', 'status', 'comment']
        
        
class MagazinePapersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paper
        fields = ['id', 'title', 'status']
        order = ['-created_at']

class NewOrUpdatePaperSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paper
        fields = ['title', 'abstract', 'paper_type', 'category', 'keywords', 'file', 'comment', 'magazine']
        extra_kwargs = {
            'magazine': {'read_only': True}
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

class PaperListSerializer(serializers.ModelSerializer):
    magazine = serializers.SerializerMethodField()

    class Meta:
        model = Paper
        fields = ['id', 'title', 'author', 'magazine', 'status', 'created_at']
        ordering = ['-author.last_name', '-author.first_name', '-created_at']

    def get_magazine(self, obj):
        return {
            "id": obj.magazine.id,
            "name": obj.magazine.name
        } if obj.magazine else None

class AnonymizedDetailedReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaperReview
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

class PaperReviewSerializer(serializers.ModelSerializer):
    reviewer = ReviewerSerializer()
    
    class Meta:
        model = PaperReview
        fields = ['id', 'paper', 'reviewer', 'comment', 'status', 'review_date', 'grade', 'custom_grade', 'decision',
                  'content_consistency', 'goal_formulation', 'structure_correctness', 
                  'terminology_relevance', 'graphic_design', 'aesthetics', 
                  'literature_selection', 'conclusions_correctness', 'goal_achievement', 
                  'language_correctness', 'is_admin_review']
    
    is_admin_review = serializers.SerializerMethodField()

    def get_is_admin_review(self, obj):
        return obj.reviewer.is_staff

class PaperReviewReviewerSerializer(serializers.ModelSerializer):
    paper = serializers.SerializerMethodField()

    class Meta:
        model = PaperReview
        fields = ['id', 'paper', 'status']
        
    def get_paper(self, obj):
        return {
            "id": obj.paper.id,
            "title": obj.paper.title
        } if obj.paper else None

class AuthorPaperSerializer(serializers.ModelSerializer):
    '''Used for author PaperView'''
    reviews = serializers.SerializerMethodField()
    magazine = serializers.SerializerMethodField()

    class Meta:
        model = Paper
        fields = ['id', 'title', 'abstract', 'status', 'created_at', 'category', 'paper_type', 'keywords', 'file', 'reviews', 'magazine', 'comment']

    def get_reviews(self, obj):
        reviews = obj.reviews.filter(status=PaperReview.PaperReviewStatus.APPROVED)
        return AnonymizedDetailedReviewSerializer(reviews, many=True).data

    def get_magazine(self, obj):
        return {
            "id": obj.magazine.id,
            "name": obj.magazine.name
        } if obj.magazine else None


class ReviewerPaperSerializer(serializers.ModelSerializer):
    '''Used for reviewer PaperView'''
    to_review = serializers.SerializerMethodField()
    magazine = serializers.SerializerMethodField()
    review = serializers.SerializerMethodField()

    class Meta:
        model = Paper
        fields = ['id', 'title', 'abstract', 'created_at', 'category', 'paper_type', 'keywords', 'file', 'to_review', 'magazine', 'review']
    
    def get_to_review(self, obj):
        # Logic to determine if the paper is "to review" for the current user
        request = self.context.get('request')
        if request and request.user in obj.reviewers.all():
            return True
        return False

    def get_magazine(self, obj):
        return {
            "id": obj.magazine.id,
            "name": obj.magazine.name
        } if obj.magazine else None

    def get_review(self, obj):
        # Logic to fetch the review of the current user for this paper
        request = self.context.get('request')
        if request:
            review = obj.reviews.filter(reviewer=request.user).first()
            if review:
                return AnonymizedDetailedReviewSerializer(review).data
        return None


class AdminPaperSerializer(serializers.ModelSerializer):
    '''Used for admin PaperView'''
    reviews = PaperReviewSerializer(many=True)
    author = UserSerializer()
    magazine = serializers.SerializerMethodField()

    class Meta:
        model = Paper
        fields = ['id', 'title', 'author', 'abstract', 'status', 'created_at', 'category', 'paper_type', 'keywords', 'file', 'reviews', 'magazine', 'comment']

    def get_magazine(self, obj):
        return {
            "id": obj.magazine.id,
            "name": obj.magazine.name
        } if obj.magazine else None
    

class CreateReviewSerializer(serializers.ModelSerializer):
    paper_id = serializers.IntegerField(write_only=True)
    comment = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = PaperReview
        fields = ['paper_id', 'comment', 'decision', 'grade', 'custom_grade', 'content_consistency', 'goal_formulation', 
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
        paper_id = data.get('paper_id')

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
            paper = Paper.objects.get(id=paper_id)
        except Paper.DoesNotExist:
            raise serializers.ValidationError({"paper_id": "Artykuł nie istnieje"})

        if not user.is_staff and user not in paper.reviewers.all():
            raise serializers.ValidationError({"error": "Użytkownik nie jest recenzentem tego artykułu"})

        if paper.status in [Paper.PaperStatus.APPROVED, Paper.PaperStatus.PUBLISHED, Paper.PaperStatus.REJECTED]:
            raise serializers.ValidationError({"error": "Nie można dodać recenzji do zatwierdzonych, odrzuconych lub opublikowanych artykułów"})

        return data

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user
        paper_id = validated_data.pop('paper_id')
        paper = Paper.objects.get(id=paper_id)

        review, created = PaperReview.objects.get_or_create(paper=paper, reviewer=user)
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
            if review.decision == PaperReview.ReviewDecision.ACCEPT:
                paper.status = Paper.PaperStatus.APPROVED
            elif review.decision == PaperReview.ReviewDecision.REJECT:
                paper.status = Paper.PaperStatus.REJECTED
            elif review.decision in [PaperReview.ReviewDecision.MINOR_REVISION, PaperReview.ReviewDecision.MAJOR_REVISION]:
                paper.status = Paper.PaperStatus.WAITING_FOR_REVISION
            paper.save()


        return review