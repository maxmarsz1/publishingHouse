import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faChevronDown, faChevronUp, faStar, faDownload } from '@fortawesome/free-solid-svg-icons'

import { Review, ReviewStatus, ReviewStatusDisplay, reviewCriteriaDisplay, ReviewDecisionDisplay } from '@/app/types/types'
import { approveReview, downloadReviewPDF } from '@/app/utils/paper-helper'
import styles from './Table.module.css'
import { Button } from '@mui/material'
import { useUser } from '@/app/context/UserContext'

interface Props {
  isAuthor: boolean | undefined;
  reviews: Review[];
  onReviewApproved?: () => void;
}

const PaperReviewsTable = ({ isAuthor, reviews, onReviewApproved }: Props) => {
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

  return (
    <div className={styles.tableWrapper}>
      <h2 style={{ marginTop: "2rem" }}>Recenzje artykułu</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th style={{ width: '40px' }}></th>
            <th>Recenzent</th>
            {!isAuthor &&
              <th>Status</th>
            }
            <th>Decyzja</th>
            <th>Ocena</th>
            {isStaff && <th>Akcje</th>}
          </tr>
        </thead>
        <tbody>
          {reviews.map((review, index) => {
            const isExpanded = expandedRows.includes(index);
            let reviewerName = "Anonimowy";
            if (!isAuthor) {
              reviewerName = review.reviewer?.first_name + " " + review.reviewer?.last_name;
            }
            else if (review.is_admin_review) {
              reviewerName = "Edytor czasopisma";
            }
            return (
              <React.Fragment key={index}>
                <tr onClick={() => toggleRow(index)} style={{ cursor: 'pointer' }}>
                  <td>
                    <button className={styles.expandButton} onClick={(e) => { e.stopPropagation(); toggleRow(index); }}>
                      <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} />
                    </button>
                  </td>
                  <td className={styles.user}>
                    {reviewerName} {review.is_admin_review && <FontAwesomeIcon icon={faStar} className={styles.adminStar} title="Recenzja edytora" style={{ color: "gold", marginLeft: "5px" }} />}
                  </td>
                  {!isAuthor && <td className={styles.status}>
                    {ReviewStatusDisplay[review.status]} </td>}
                  <td className={styles.decision}>
                    {review.decision ? ReviewDecisionDisplay[review.decision] : "-"}
                  </td>
                  <td className={styles.grade}>{((review.custom_grade ?? review.grade) === undefined || (review.custom_grade ?? review.grade) === null ? "-" : (Math.round((review.custom_grade ?? review.grade)! * 2) / 2).toFixed(2))}</td>
                  {isStaff &&
                    <td>
                      {isStaff && review.status === ReviewStatus.Sumbitted &&
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={(e) => handleApprove(e, review.id)}
                          className={styles.approveButton}
                          title="Zatwierdź recenzję"
                        >
                          <FontAwesomeIcon icon={faCheck} />
                        </Button>
                      }
                      {(isStaff && (review.status === ReviewStatus.Sumbitted || review.status === ReviewStatus.Approved)) &&
                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          onClick={(e) => handleDownloadReview(e, review.id)}
                          className={styles.approveButton}
                          style={{ marginLeft: '5px' }}
                          title="Pobierz PDF"
                        >
                          <FontAwesomeIcon icon={faDownload} />
                        </Button>
                      }
                    </td>
                  }
                </tr>
                <tr>
                  <td colSpan={isAuthor ? 4 : 6} className={styles.expandedRowContainer}>
                    <div className={`${styles.expandableContent} ${isExpanded ? styles.expanded : ''}`}>
                      <div className={styles.overflowHidden}>
                        <div className={styles.expandedContent}>
                          <div className={styles.detailsGrid}>
                            <div className={styles.label}>Komentarz</div>
                            <div className={styles.value}>
                              {!review.comment ? "-" : review.comment}
                            </div>
                            {!review.is_admin_review && Object.entries(reviewCriteriaDisplay).map(([key, label]) => {
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              const value = (review as any)[key];
                              return (
                                <React.Fragment key={key}>
                                  <div className={styles.label}>{label}</div>
                                  <div className={styles.value}>{value ?? '-'}</div>
                                </React.Fragment>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            );
          })}
          {reviews.length == 0 &&
            <tr>
              <td style={{ width: '40px' }}></td>
              <td colSpan={isAuthor ? 6 : 5}>Brak recenzji</td>
            </tr>
          }
          {reviews.length > 0 && (() => {
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
            const finalGradeDisplay = hasGrade ? (Math.round(finalGradeValue * 2) / 2).toFixed(2) : "-";

            return (
              <tr style={{ borderTop: "2px solid var(--border)" }}>
                <td></td>
                <td></td>
                {!isAuthor && <td></td>}
                <td style={{ fontWeight: 'bold', textAlign: 'right' }}>Ocena końcowa:</td>
                <td style={{ fontWeight: 'bold' }} className={styles.grade}>{finalGradeDisplay}</td>
                {isStaff && <td></td>}
              </tr>
            )
          })()}
        </tbody>
      </table>
    </div>
  )
}

export default PaperReviewsTable