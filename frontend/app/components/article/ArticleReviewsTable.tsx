import React from 'react'

import { Review, ReviewStatusDisplay } from '@/app/types/types'
import styles from './Table.module.css'

interface Props {
    isAuthor: boolean | undefined;
    reviews: Review[];
}

const ArticleReviewsTable = ({ isAuthor, reviews }: Props) => {
  const showReviewer = typeof isAuthor === undefined || !isAuthor;
  return (
    <div className={styles.tableWrapper}>
      <h2 style={{marginTop: "2rem"}}>Recenzje artykułu</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            {showReviewer &&
            <th>Recenzent</th>
            }
            <th>Status recenzji</th>
            <th>Komentarz</th>
            <th>Ocena</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review, index) => (
            <tr key={index}>
              {showReviewer &&
              <td className={styles.user}>
                {review.reviewer?.first_name} {review.reviewer?.last_name} ({review.reviewer?.username})
              </td>
              }
              <td className={styles.status}>{ReviewStatusDisplay[review.status]}</td>
              <td className={styles.comment}>{!review.comment ? "Brak" : review.comment}</td>
              <td className={styles.grade}>{(!review.grade ? "Brak" : review.grade)}</td>
            </tr>
          ))}
          {reviews.length == 0 &&
            <tr>
              <td colSpan={showReviewer ? 4 : 3}>Brak recenzji</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  )
}

export default ArticleReviewsTable