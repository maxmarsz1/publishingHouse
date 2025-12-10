from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from users.models import User
from publishers.models import Publisher


class Raport(models.Model):
    class RaportStatus(models.TextChoices):
        SENT = 'sent', 'Sent'
        PENDING = 'pending', 'Pending'
        APPROVED = 'approved', 'Approved'
        PUBLISHED = 'published', 'Published'
        REJECTED = 'rejected', 'Rejected'


    class RaportType(models.TextChoices):
        ORIGINAL_RESEARCH = "original_research", "Artykuł oryginalny"
        REVIEW_ARTICLE = "review_article", "Artykuł przeglądowy"
        SYSTEMATIC_REVIEW = "systematic_review", "Przegląd systematyczny"
        META_ANALYSIS = "meta_analysis", "Metaanaliza"
        CASE_REPORT = "case_report", "Raport przypadku / Studium przypadku"
        SHORT_COMMUNICATION = "short_communication", "Krótki komunikat / Krótki raport"
        METHOD_ARTICLE = "method_article", "Artykuł metodologiczny"
        COMMENTARY = "commentary", "Komentarz / Opinia / List do redakcji"
        THEORETICAL_PAPER = "theoretical_paper", "Artykuł teoretyczny"
        CLINICAL_TRIAL_REPORT = "clinical_trial_report", "Raport z badania klinicznego"
        SOFTWARE_TOOL_ARTICLE = "software_tool_article", "Artykuł oprogramowania"
        TECHNICAL_REPORT = "technical_report", "Raport techniczny"
        OTHER = "other", "Inny"


    class ITRaportCategory(models.TextChoices):
        ARTIFICIAL_INTELLIGENCE = "artificial_intelligence", "Sztuczna Inteligencja (AI)"
        MACHINE_LEARNING = "machine_learning", "Uczenie Maszynowe (ML)"
        DATA_SCIENCE = "data_science", "Data Science / Analiza Danych"
        CYBERSECURITY = "cybersecurity", "Cyberbezpieczeństwo"
        CLOUD_COMPUTING = "cloud_computing", "Przetwarzanie w Chmurze (Cloud Computing)"
        WEB_DEVELOPMENT = "web_development", "Tworzenie Aplikacji Webowych"
        MOBILE_DEVELOPMENT = "mobile_development", "Tworzenie Aplikacji Mobilnych"
        GAME_DEVELOPMENT = "game_development", "Tworzenie Gier"
        DEVOPS = "devops", "DevOps"
        NETWORKING = "networking", "Sieci Komputerowe"
        DATABASES = "databases", "Bazy Danych"
        OPERATING_SYSTEMS = "operating_systems", "Systemy Operacyjne"
        SOFTWARE_ENGINEERING = "software_engineering", "Inżynieria Oprogramowania"
        COMPUTER_GRAPHICS = "computer_graphics", "Grafika Komputerowa"
        ROBOTICS = "robotics", "Robotyka"
        INTERNET_OF_THINGS = "internet_of_things", "Internet Rzeczy (IoT)"
        BLOCKCHAIN = "blockchain", "Blockchain / Kryptowaluty"
        QUANTUM_COMPUTING = "quantum_computing", "Obliczenia Kwantowe"
        HUMAN_COMPUTER_INTERACTION = "human_computer_interaction", "Interakcja Człowiek-Komputer (HCI)"
        OTHER = "other", "Inne"


    title = models.CharField(max_length=255)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='authored_raports')
    reviewers = models.ManyToManyField(
        User,
        through='RaportReview',
        related_name='reviewed_raports',
        blank=True
    )
    publisher = models.ForeignKey(Publisher, on_delete=models.CASCADE, related_name='raports')
    status = models.CharField(
        max_length=10,
        choices=RaportStatus.choices,
        default=RaportStatus.SENT
    )
    raport_type = models.CharField(
        max_length=30,
        choices=RaportType.choices,
        default=RaportType.ORIGINAL_RESEARCH
    )
    category = models.CharField(
        max_length=30,
        choices=ITRaportCategory.choices,
        default=ITRaportCategory.ARTIFICIAL_INTELLIGENCE
    )
    abstract = models.TextField()
    file = models.FileField(upload_to='raports/files/')
    keywords = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    comment = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.title} by {self.author.username} - {self.get_status_display()}"

    class Meta:
        verbose_name = 'Raport'
        verbose_name_plural = 'Raports'
        ordering = ['-created_at']


class RaportReview(models.Model):
    class RaportReviewStatus(models.TextChoices):
        PENDING = 'pending', 'Pending Review'
        SUBMITTED = 'submitted', 'Submitted Review'
        APPROVED = 'approved', 'Approved'
        INVITE_SENT = 'invited', 'Reviewer Invited'
        INVITE_REJECTED = 'invite_rejected', 'Invite rejected'

    class ReviewDecision(models.TextChoices):
        ACCEPT = 'accept', 'Accept'
        MINOR_REVISION = 'minor_revision', 'Minor Revision'
        MAJOR_REVISION = 'major_revision', 'Major Revision'
        REJECT = 'reject', 'Reject'


    raport = models.ForeignKey(Raport, on_delete=models.CASCADE, related_name='raport_reviews')
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_reviews')
    review_date = models.DateTimeField(null=True, blank=True)
    comment = models.TextField(blank=True, null=True)
    grade = models.FloatField(null=True, blank=True, help_text='Grade from 0 to 5')
    
    content_consistency = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(5)], null=True, blank=True)
    goal_formulation = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(5)], null=True, blank=True)
    structure_correctness = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(5)], null=True, blank=True)
    terminology_relevance = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(5)], null=True, blank=True)
    graphic_design = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(5)], null=True, blank=True)
    aesthetics = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(5)], null=True, blank=True)
    literature_selection = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(5)], null=True, blank=True)
    conclusions_correctness = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(5)], null=True, blank=True)
    goal_achievement = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(5)], null=True, blank=True)
    language_correctness = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(5)], null=True, blank=True)

    status = models.CharField(
        max_length=20,
        choices=RaportReviewStatus.choices,
        default=RaportReviewStatus.INVITE_SENT
    )

    decision = models.CharField(
        max_length=20,
        choices=ReviewDecision.choices,
        null=True,
        blank=True
    )

    class Meta:
        unique_together = ('raport', 'reviewer')
        verbose_name = 'Raport Review'
        verbose_name_plural = 'Raport Reviews'

    def __str__(self):
        return f"{self.reviewer.username} reviewing {self.raport.title} ({self.get_status_display()})"

    def save(self, *args, **kwargs):
        fields = [
            self.content_consistency, self.goal_formulation, self.structure_correctness,
            self.terminology_relevance, self.graphic_design, self.aesthetics,
            self.literature_selection, self.conclusions_correctness, self.goal_achievement,
            self.language_correctness
        ]
        valid_scores = [field for field in fields if field is not None]
        
        if valid_scores:
            self.grade = sum(valid_scores) / len(valid_scores)
        else:
            self.grade = None
        
        super().save(*args, **kwargs)