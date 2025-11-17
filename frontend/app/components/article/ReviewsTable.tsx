import { Review } from '@/app/types/types'
import React from 'react'
import styles from './Table.module.css'
import { ReviewStatusDisplay } from '@/app/types/types';

interface Props {
    reviews: Review[];
}

const ReviewsTable = ({reviews}: Props) => {
    const showReviewersAndGrades = reviews.some(review => review.reviewer);

  return (
    <div className={styles.tableWrapper}>
        <h2>Twoje recenzje</h2>
        <table className={styles.table}>
            <thead>
                <tr>
                    <th>Raport</th>
                    {showReviewersAndGrades &&
                    <th>Użytkownik</th>
                    }
                    <th>Status recenzji</th>
                    {showReviewersAndGrades &&
                    <th>Ocena</th>
                    }
                </tr>
            </thead>
            <tbody>
                {reviews.map((review, index) => (
                    <tr key={index}>
                        <td className={styles.title}>
                            <a href={`/myspace/articles/${review.raport?.id}`}>{review.raport?.title}</a>
                        </td>
                        {showReviewersAndGrades &&
                        <td className={styles.user}>
                            {review.reviewer?.first_name} {review.reviewer?.last_name} ({review.reviewer?.username})
                        </td>
                        }
                        <td className={styles.status}>{ReviewStatusDisplay[review.status]}</td>
                        
                        {showReviewersAndGrades &&
                        <td className={styles.grade}>{(review.grade == 0 ? "-" : review.grade)}</td>
                        }
                    </tr>
                ))}
                {reviews.length == 0 &&
                <tr>
                    <td>Brak recenzji</td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                }
            </tbody>
        </table>
    </div>
  )
}

export default ReviewsTable