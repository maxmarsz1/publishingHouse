import React from "react";
import styles from "./ArticleReviewerInfo.module.css";
import { Review, ReviewStatus, ReviewStatusDisplay } from "@/app/types/types";
import { faCheckCircle, faHourglassHalf, faTimesCircle, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ArticleReviewerInfoProps {
  review: Review;
}

const ArticleReviewerInfo = ({ review }: ArticleReviewerInfoProps) => {
  const reviewDateReadable = review.review_date ? new Date(review.review_date).toLocaleDateString(
    "pl-PL",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }
  ) : "Brak";
    
  const statusIcon: Record<ReviewStatus, IconDefinition> = {
    submitted: faCheckCircle,
    pending: faHourglassHalf,
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.h2}>
        Status twojej recenzji:
        <div className={styles.reviewStatus}>
            {<FontAwesomeIcon icon={statusIcon[review.status]} className={styles.statusIcon} />}&nbsp;
            {ReviewStatusDisplay[review.status]}
        </div>
      </h2>
      <div className={styles.grid}>
        <div className={styles.header}>Komentarz</div>
        <div className={styles.header}>Ocena</div>
        <div className={styles.header}>Data recenzji</div>
        <div>
            {review.comment || "Brak komentarza"}
        </div>
        <div>
            {review.grade != null ? review.grade : "Brak oceny"}
        </div>
        <div>{reviewDateReadable}</div>
      </div>
    </div>
  );
};

export default ArticleReviewerInfo;
