import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faChevronDown, faChevronUp, faStar } from '@fortawesome/free-solid-svg-icons'

import { Review, ReviewStatus, ReviewStatusDisplay, reviewCriteriaDisplay, ReviewDecisionDisplay } from '@/app/types/types'
import { approveReview } from '@/app/utils/article-helper'
import styles from './Table.module.css'
import { Button } from '@mui/material'
import { useUser } from '@/app/context/UserContext'

interface Props {
  isAuthor: boolean | undefined;
  reviews: Review[];
  onReviewApproved?: () => void;
}

const ArticleReviewsTable = ({ isAuthor, reviews, onReviewApproved }: Props) => {
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
                      {review.status === ReviewStatus.Sumbitted &&
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={(e) => handleApprove(e, review.id)}
                          className={styles.approveButton}
                        >
                          <FontAwesomeIcon icon={faCheck} />
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
        </tbody>
      </table>
    </div>
  )
}

export default ArticleReviewsTable