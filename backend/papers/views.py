from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.core.exceptions import ObjectDoesNotExist
from django.utils import timezone
from django.http import FileResponse

from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from io import BytesIO
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_JUSTIFY, TA_LEFT

from papers.models import Paper, PaperReview
from users.models import User
from magazines.models import Magazine, MagazineMembership

from papers.serializers import PaperSerializer, PaperReviewSerializer, PaperListSerializer, PaperReviewReviewerSerializer, AdminPaperSerializer, AuthorPaperSerializer, ReviewerPaperSerializer, NewOrUpdatePaperSerializer, CreateReviewSerializer


class PaperViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminUser]
    queryset = Paper.objects.all()
    serializer_class = PaperSerializer
    
class PaperReviewViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminUser]
    queryset = PaperReview.objects.all()
    serializer_class = PaperReviewSerializer
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        review = self.get_object()
        if review.status != PaperReview.PaperReviewStatus.SUBMITTED:
            return Response(
                {"error": "Tylko przesłane recenzje mogą zostać zatwierdzone."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        review.status = PaperReview.PaperReviewStatus.APPROVED
        review.save()
        return Response({'status': 'review approved'}, status=status.HTTP_200_OK)

class ReviewPDFView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, pk):
        try:
            # Register Fonts checking typical paths
            font_path = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
            font_path_bold = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
            
            try:
                pdfmetrics.registerFont(TTFont('DejaVuSans', font_path))
                pdfmetrics.registerFont(TTFont('DejaVuSans-Bold', font_path_bold))
                font_regular = 'DejaVuSans'
                font_bold = 'DejaVuSans-Bold'
            except:
                font_regular = 'Helvetica'
                font_bold = 'Helvetica-Bold'

            review = PaperReview.objects.get(id=pk)
            
            user = request.user
            if review.status not in ['submitted', 'approved'] and not user.is_staff and user != review.reviewer:
                 return Response({"error": "Recenzja nie jest jeszcze dostępna."}, status=status.HTTP_403_FORBIDDEN) 

            buffer = BytesIO()
            doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=50, leftMargin=50, topMargin=50, bottomMargin=50)
            
            styles = getSampleStyleSheet()
            # Define Custom Styles with Polish support
            styleN = ParagraphStyle(
                'NormalPolish', 
                parent=styles['Normal'], 
                fontName=font_regular, 
                fontSize=10, 
                leading=12
            )
            styleH = ParagraphStyle(
                'HeadingPolish',
                parent=styles['Heading1'],
                fontName=font_bold,
                fontSize=16,
                leading=20,
                spaceAfter=20
            )
            styleBold = ParagraphStyle(
                'BoldPolish',
                parent=styles['Normal'],
                fontName=font_bold,
                fontSize=12,
                leading=14,
                spaceAfter=6
            )
            
            story = []

            # Helper to translate decision
            decision_map = {
                'accept': 'Akceptacja',
                'minor_revision': 'Drobne poprawki',
                'major_revision': 'Znaczne poprawki',
                'reject': 'Odrzucenie',
            }
            decision_text = decision_map.get(review.decision, review.decision or "Brak")

            # Helper to format date
            date_str = "N/A"
            if review.review_date:
                date_str = review.review_date.strftime("%d.%m.%Y")

            # Content Construction
            story.append(Paragraph(f"Recenzja Artykułu: {review.paper.title}", styleH))
            
            story.append(Paragraph(f"<b>Magazyn:</b> {review.paper.magazine.name}", styleN))
            story.append(Spacer(1, 6))
            story.append(Paragraph(f"<b>Autor:</b> {review.paper.author.first_name} {review.paper.author.last_name}", styleN))
            story.append(Spacer(1, 6))
            story.append(Paragraph(f"<b>Recenzent:</b> {review.reviewer.first_name} {review.reviewer.last_name}", styleN))
            story.append(Spacer(1, 6))
            story.append(Paragraph(f"<b>Data recenzji:</b> {date_str}", styleN))
            story.append(Spacer(1, 6))
            story.append(Paragraph(f"<b>Decyzja:</b> {decision_text}", styleN))
            story.append(Spacer(1, 20))

            # Comment
            story.append(Paragraph("Komentarz:", styleBold))
            comment_text = review.comment or "Brak komentarza"
            # Handle paragraphs in comment
            for para in comment_text.split('\\n'):
                if para.strip():
                    story.append(Paragraph(para, styleN))
                    story.append(Spacer(1, 6))
            
            story.append(Spacer(1, 20))

            if not review.reviewer.is_staff:
                # Criteria
                story.append(Paragraph("Kryteria Oceny:", styleBold))
                story.append(Spacer(1, 10))

                criteria_data = [
                    ['Kryterium', 'Ocena']
                ]
            
                criteria_fields = [
                    ('Zgodność treści pracy z tematem', review.content_consistency),
                    ('Sformułowanie celu pracy', review.goal_formulation),
                    ('Poprawność układu pracy', review.structure_correctness),
                    ('Trafność zastosowanej terminologii', review.terminology_relevance),
                    ('Opracowanie graficzne pracy', review.graphic_design),
                    ('Estetyka pracy', review.aesthetics),
                    ('Dobór literatury', review.literature_selection),
                    ('Poprawność sformułowanych wniosków', review.conclusions_correctness),
                    ('Osiągnięcie celu pracy', review.goal_achievement),
                    ('Stylistyka i poprawność językowa', review.language_correctness),
                ]

                for label, score in criteria_fields:
                    score_str = str(score) if score is not None else '-'
                    criteria_data.append([label, score_str])

                # Table for Criteria
                t = Table(criteria_data, colWidths=[300, 100])
                t.setStyle(TableStyle([
                    ('FONTNAME', (0,0), (-1,-1), font_regular),
                    ('FONTNAME', (0,0), (-1,0), font_bold), # Header bold
                    ('BOTTOMPADDING', (0,0), (-1,0), 12),
                    ('GRID', (0,0), (-1,-1), 0.5, colors.grey),
                ]))
                story.append(t)
                story.append(Spacer(1, 20))

            # Final Grade
            final_grade = review.custom_grade if review.custom_grade is not None else review.grade
            final_grade_str = str(final_grade) if final_grade is not None else '-'
            story.append(Paragraph(f"<b>Ocena Końcowa:</b> {final_grade_str}", styleBold))

            doc.build(story)
            buffer.seek(0)
            return FileResponse(buffer, as_attachment=True, filename=f"review_{pk}.pdf")

        except PaperReview.DoesNotExist:
            return Response({"error": "Recenzja nie istnieje."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PapersView(APIView):
    serializer_class = PaperListSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = self.request.user
        authored_papers = Paper.objects.filter(author=user)
        user_reviews = PaperReview.objects.filter(reviewer=user)
        
        authored_serializer = self.serializer_class(authored_papers, many=True)
        reviews_serializer = PaperReviewReviewerSerializer(user_reviews, many=True)
        
        user_papers = {
            "authored_papers": authored_serializer.data,
            "user_reviews": reviews_serializer.data
        }
        return Response(user_papers, status=status.HTTP_200_OK)
    
    
class PaperDetailUpdateDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        user = request.user

        try:
            paper = Paper.objects.get(id=pk)

            if user.is_staff:
                serializer = AdminPaperSerializer(paper)
            elif user == paper.author:
                serializer = AuthorPaperSerializer(paper)
                data = serializer.data
                data['is_author'] = True
                return Response(data)
            elif user in paper.reviewers.all():
                serializer = ReviewerPaperSerializer(paper, context={'request': request})
            else:
                return Response(
                    {"error": "Nie masz uprawnień do przeglądania tego artykułu."},
                    status=status.HTTP_403_FORBIDDEN
                )

            return Response(serializer.data)

        except ObjectDoesNotExist:
            return Response(
                {"error": "Artykuł nie istnieje."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
    def put(self, request, pk):
        user = request.user

        try:
            paper = Paper.objects.get(id=pk)

            if user != paper.author:
                return Response(
                    {"error": "Nie masz uprawnień do edycji tego artykułu."},
                    status=status.HTTP_403_FORBIDDEN
                )
                
            if paper.magazine.due_date and paper.magazine.due_date < timezone.now().date():
                return Response(
                    {"error": "Nie można zaktualizować tego artykułu. Termin magazynu minął."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if paper.status in [Paper.PaperStatus.APPROVED, Paper.PaperStatus.PUBLISHED, Paper.PaperStatus.REJECTED]:
                return Response(
                    {"error": "Nie można zaktualizować tego artykułu. Jego status nie pozwala na aktualizacje."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            serializer = NewOrUpdatePaperSerializer(paper, data=request.data, partial=True)
            if serializer.is_valid():
                # Check status BEFORE saving
                was_waiting_for_revision = paper.status == Paper.PaperStatus.WAITING_FOR_REVISION
                
                updated_paper = serializer.save()
                
                if was_waiting_for_revision:
                    updated_paper.status = Paper.PaperStatus.PENDING
                    updated_paper.save()
                    
                    reviews = updated_paper.reviews.all()
                    for review in reviews:
                        if review.reviewer.is_staff:
                            review.delete()
                        else:
                            review.comment = None
                            review.grade = None
                            review.decision = None
                            review.review_date = None
                            
                            review.content_consistency = None
                            review.goal_formulation = None
                            review.structure_correctness = None
                            review.terminology_relevance = None
                            review.graphic_design = None
                            review.aesthetics = None
                            review.literature_selection = None
                            review.conclusions_correctness = None
                            review.goal_achievement = None
                            review.language_correctness = None
                            
                            review.status = PaperReview.PaperReviewStatus.PENDING
                            review.save()
                    
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except ObjectDoesNotExist:
            return Response(
                {"error": "Artykuł nie istnieje."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
    def delete(self, request, pk):
        user = request.user

        try:
            paper = Paper.objects.get(id=pk)

            if user != paper.author and not user.is_superuser:
                return Response(
                    {"error": "Nie masz uprawnień do usunięcia tego artykułu."},
                    status=status.HTTP_403_FORBIDDEN
                )
                
            if paper.magazine.due_date and paper.magazine.due_date < timezone.now():
                return Response(
                    {"error": "Nie można usunąć artykułu. Termin magazynu minął."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            paper.delete()
            return Response(
                {"message": "Artykuł usunięty pomyślnie."},
                status=status.HTTP_200_OK
            )

        except ObjectDoesNotExist:
            return Response(
                {"error": "Artykuł nie istnieje."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
class CreatePaperView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        user = request.user

        try:
            magazine = Magazine.objects.get(id=pk)
            if not MagazineMembership.objects.filter(magazine_id=magazine.id, user=user).exists():
                return Response({"error": "Musisz być członkiem magazynu, aby utworzyć artykuł."}, status=status.HTTP_403_FORBIDDEN)

            if Paper.objects.filter(magazine_id=magazine.id, author=user).exists():
                return Response({"error": "Możesz opublikować tylko jeden artykuł dla każdego magazynu."}, status=status.HTTP_400_BAD_REQUEST)
            
            if magazine.due_date and magazine.due_date < timezone.now().date():
                return Response(
                    {"error": "Nie można utworzyć artykułu. Termin magazynu minął."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            serializer = NewOrUpdatePaperSerializer(data=request.data)
            if serializer.is_valid():
                paper = serializer.save(author=user, magazine=magazine)
                return Response(PaperSerializer(paper).data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class DownloadPaperFileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            paper = Paper.objects.get(id=pk)
            user = request.user
            
            if not (user.is_staff or user == paper.author or user in paper.reviewers.all()):
                return Response({"error": "Nie masz uprawnień do pobrania tego artykułu."}, status=status.HTTP_403_FORBIDDEN)

            if not paper.file:
                return Response({"error": "Brak pliku powiązanego z tym artykułem."}, status=status.HTTP_404_NOT_FOUND)

            response = FileResponse(paper.file.open(), as_attachment=True, filename=paper.file.name)
            return response

        except Paper.DoesNotExist:
            return Response({"error": "Artykuł nie znaleziony."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UpdateReviewInviteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        user = request.user

        try:
            review = PaperReview.objects.get(id=pk)

            if review.reviewer != user:
                return Response(
                    {"error": "Nie masz uprawnień do aktualizacji tego zaproszenia do recenzji."},
                    status=status.HTTP_403_FORBIDDEN
                )
            if review.status != PaperReview.PaperReviewStatus.INVITE_SENT:
                return Response(
                    {"error": "Tego zaproszenia do recenzji nie można zaktualizować."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            accept = request.data.get('accept')
            if accept is None:
                return Response(
                    {"error": "Pole accept jest wymagane."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            review.status = PaperReview.PaperReviewStatus.PENDING if accept else PaperReview.PaperReviewStatus.INVITE_REJECTED
            review.save()

            return Response(
                {"message": "Status zaproszenia do recenzji zaktualizowany pomyślnie."},
                status=status.HTTP_200_OK
            )

        except ObjectDoesNotExist:
            return Response(
                {"error": "Recenzja nie istnieje."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
class CreateReviewView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        user = request.user

        try:
            data = request.data.copy()
            data['paper_id'] = pk

            serializer = CreateReviewSerializer(data=data, context={'request': request})
            if serializer.is_valid():
                serializer.save(reviewer=user)
                return Response({"message": "Recenzja utworzona pomyślnie"}, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
