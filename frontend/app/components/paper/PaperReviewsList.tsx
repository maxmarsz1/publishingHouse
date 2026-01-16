import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faChevronDown, faChevronUp, faStar, faDownload } from '@fortawesome/free-solid-svg-icons';
import { Review, ReviewStatus, ReviewStatusDisplay, reviewCriteriaDisplay, ReviewDecisionDisplay } from '@/app/types/types';
import { approveReview, downloadReviewPDF } from '@/app/utils/paper-helper';
import styles from './PaperReviewsList.module.css';
import { Button, Chip } from '@mui/material';
import { useUser } from '@/app/context/UserContext';

interface Props {
    isAuthor: boolean | undefined;
    reviews: Review[];
    onReviewApproved?: () => void;
}

const PaperReviewsList = ({ isAuthor, reviews, onReviewApproved }: Props) => {
    const [expandedRows, setExpandedRows] = useState<number[]>([]);
    const { isStaff } = useUser();

    const handleApprove = async (e: React.MouseEvent, reviewId: number) => {
        e.stopPropagation();
        try {
            await approveReview(reviewId);
            if (onReviewApproved) {
                onReviewApproved();
            }
        } catch (error) {
            console.error("Failed to approve review", error)
        }
    }

    const handleDownloadReview = async (e: React.MouseEvent, reviewId: number) => {
        e.stopPropagation();
        try {
            const response = await downloadReviewPDF(reviewId);
            const blob = new Blob([response], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `review_${reviewId}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading review:", error);
        }
    }

    const toggleRow = (index: number) => {
        setExpandedRows(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    const getFinalGrade = () => {
        const adminReview = reviews.find(r => r.custom_grade);
        let finalGradeValue = 0;
        let hasGrade = false;

        if (adminReview && adminReview.custom_grade) {
            finalGradeValue = adminReview.custom_grade;
            hasGrade = true;
        } else {
            const validReviews = reviews.filter(r => r.grade);
            if (validReviews.length > 0) {
                const sum = validReviews.reduce((acc, r) => acc + (r.grade || 0), 0);
                finalGradeValue = sum / validReviews.length;
                hasGrade = true;
            }
        }
        return hasGrade ? (Math.round(finalGradeValue * 2) / 2).toFixed(2) : "-";
    };

    return (
        <div style={{ marginBottom: '32px' }}>
            <h2 style={{ marginTop: "2rem", marginBottom: "16px" }}>Recenzje artykułu</h2>

            {reviews.length === 0 ? (
                <div className={styles.emptyState}>
                    Brak recenzji
                </div>
            ) : (
                <div className={styles.container}>
                    {reviews.map((review, index) => {
                        const isExpanded = expandedRows.includes(index);
                        let reviewerName = "Anonimowy";
                        if (!isAuthor) {
                            reviewerName = review.reviewer?.first_name + " " + review.reviewer?.last_name;
                        } else if (review.is_admin_review) {
                            reviewerName = "Edytor czasopisma";
                        }

                        const gradeDisplay = ((review.custom_grade ?? review.grade) === undefined || (review.custom_grade ?? review.grade) === null ? "-" : (Math.round((review.custom_grade ?? review.grade)! * 2) / 2).toFixed(2));

                        return (
                            <div key={index} className={styles.card}>
                                <div className={styles.cardHeader} onClick={() => toggleRow(index)}>
                                    <div className={styles.reviewerInfo}>
                                        <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} style={{ fontSize: '12px', marginRight: '8px' }} />
                                        {reviewerName}
                                        {review.is_admin_review && <FontAwesomeIcon icon={faStar} className={styles.adminStar} title="Recenzja edytora" />}
                                    </div>

                                    <div className={styles.statusContainer}>
                                        {!isAuthor && (
                                            <Chip label={ReviewStatusDisplay[review.status]} sx={{ color: 'white' }} size="small" variant="outlined" />
                                        )}
                                        <span className={styles.decision}>
                                            {review.decision ? ReviewDecisionDisplay[review.decision] : ""}
                                        </span>
                                        <span className={styles.grade}>{gradeDisplay}</span>

                                        {isStaff && (
                                            <div className={styles.actions}>
                                                {review.status === ReviewStatus.Sumbitted && (
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        size="small"
                                                        onClick={(e) => handleApprove(e, review.id)}
                                                        style={{ minWidth: '32px', padding: '4px' }}
                                                        title="Zatwierdź recenzję"
                                                    >
                                                        <FontAwesomeIcon icon={faCheck} />
                                                    </Button>
                                                )}
                                                {(review.status === ReviewStatus.Sumbitted || review.status === ReviewStatus.Approved) && (
                                                    <Button
                                                        variant="contained"
                                                        color="success"
                                                        size="small"
                                                        onClick={(e) => handleDownloadReview(e, review.id)}
                                                        style={{ minWidth: '32px', padding: '4px' }}
                                                        title="Pobierz PDF"
                                                    >
                                                        <FontAwesomeIcon icon={faDownload} />
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className={styles.expandedContent}>
                                        <div style={{ padding: '16px' }}>
                                            <div className={styles.commentSection}>
                                                <div className={styles.detailRow}>
                                                    <span className={styles.label}>Komentarz</span>
                                                    <span className={styles.value}>{review.comment || "-"}</span>
                                                </div>
                                            </div>

                                            <div className={styles.detailsGrid}>
                                                {!review.is_admin_review && Object.entries(reviewCriteriaDisplay).map(([key, label]) => {
                                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                    const value = (review as any)[key];
                                                    return (
                                                        <div key={key} className={styles.detailRow}>
                                                            <span className={styles.label}>{label}</span>
                                                            <span className={styles.value}>{value ?? '-'}</span>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    <div className={styles.summaryCard}>
                        <span className={styles.summaryLabel}>Ocena końcowa</span>
                        <span className={styles.summaryGrade}>{getFinalGrade()}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaperReviewsList;
