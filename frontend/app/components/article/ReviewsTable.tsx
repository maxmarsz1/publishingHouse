import { Review } from '@/app/types/types'
import React from 'react'
import styles from './Table.module.css'
import { ReviewStatusDisplay } from '@/app/types/types';

interface Props {
    reviews: Review[];
}

const ReviewsTable = ({ reviews }: Props) => {
    const showReviewersAndGrades = reviews.some(review => review.reviewer);

    // Raport: 2fr, Status: 1fr
    let gridTemplateColumns = "2fr 1fr";
    if (showReviewersAndGrades) {
        // Raport: 2fr, User: 1fr, Status: 1fr, Grade: 0.5fr
        gridTemplateColumns = "2fr 1fr 1fr 0.5fr";
    }

    return (
        <div className={styles.tableWrapper}>
            <h2>Twoje recenzje</h2>
            <div className={styles.gridTable}>
                <div className={styles.gridHeader} style={{ gridTemplateColumns }}>
                    <div className={styles.gridCell}>Raport</div>
                    {showReviewersAndGrades &&
                        <div className={styles.gridCell}>Użytkownik</div>
                    }
                    <div className={styles.gridCell}>Status recenzji</div>
                    {showReviewersAndGrades &&
                        <div className={styles.gridCell}>Ocena</div>
                    }
                </div>
                <div>
                    {reviews.map((review, index) => (
                        <div className={styles.gridRow} style={{ gridTemplateColumns }} key={index}>
                            <div className={styles.gridCell}>
                                <a href={`/myspace/articles/${review.raport?.id}`}>{review.raport?.title}</a>
                            </div>
                            {showReviewersAndGrades &&
                                <div className={styles.gridCell}>
                                    {review.reviewer?.first_name} {review.reviewer?.last_name} ({review.reviewer?.username})
                                </div>
                            }
                            <div className={styles.gridCell}>{ReviewStatusDisplay[review.status]}</div>

                            {showReviewersAndGrades &&
                                <div className={styles.gridCell}>{(review.grade == 0 ? "-" : (Math.round(review.grade * 2) / 2).toFixed(2))}</div>
                            }
                        </div>
                    ))}
                    {reviews.length == 0 &&
                        <div className={styles.gridRow} style={{ gridTemplateColumns: '1fr' }}>
                            <div className={styles.gridCell}>Brak recenzji</div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default ReviewsTable