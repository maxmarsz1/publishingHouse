'use client'

import React from "react";
import styles from "./ArticleReviewerInfo.module.css";
import { Review, ReviewStatus, ReviewStatusDisplay, reviewCriteriaDisplay, ReviewDecisionDisplay } from "@/app/types/types";
import { faCheckCircle, faEnvelope, faHourglassHalf, faTimesCircle, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ArticleReviewInvited from "./ArticleReviewInvited";

interface ArticleReviewerInfoProps {
  review: Review;
  reviewStatus: ReviewStatus | null;
  setReviewStatus: React.Dispatch<React.SetStateAction<ReviewStatus | null>>;
}

const ArticleReviewerInfo = ({ review, reviewStatus, setReviewStatus }: ArticleReviewerInfoProps) => {
  const reviewDateReadable = review.review_date ? new Date(review.review_date).toLocaleDateString(
    "pl-PL",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }
  ) : "-";

  const statusIcon: Record<ReviewStatus, IconDefinition> = {
    submitted: faCheckCircle,
    pending: faHourglassHalf,
    invited: faEnvelope,
    invite_rejected: faTimesCircle,
    approved: faCheckCircle
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.h2}>
        Status twojej recenzji:
        <div className={styles.reviewStatus}>
          {reviewStatus &&
            <>
              {<FontAwesomeIcon icon={statusIcon[reviewStatus]} className={styles.statusIcon} />}&nbsp;
              {ReviewStatusDisplay[reviewStatus]}
            </>
          }
        </div>
      </h2>
      {reviewStatus == ReviewStatus.Invited &&
        <ArticleReviewInvited reviewId={review.id} setReviewStatus={setReviewStatus} />
      }

      {(reviewStatus == ReviewStatus.Pending || reviewStatus == ReviewStatus.Sumbitted || reviewStatus == ReviewStatus.Approved) &&
        <div className={styles.infoGrid}>
          <div className={styles.label}>Komentarz</div>
          <div className={styles.value}>
            {review.comment || "-"}
          </div>

          <div className={styles.label}>Decyzja</div>
          <div className={styles.value}>
            {review.decision ? ReviewDecisionDisplay[review.decision] : "-"}
          </div>

          <div className={styles.label}>Ocena Średnia</div>
          <div className={styles.value}>
            {review.grade != null ? (Math.round(review.grade * 2) / 2).toFixed(2) : "-"}
          </div>

          <div className={styles.label}>Data recenzji</div>
          <div className={styles.value}>{reviewDateReadable}</div>

          {Object.entries(reviewCriteriaDisplay).map(([key, label]) => {
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
      }

    </div>
  );
};

export default ArticleReviewerInfo;
