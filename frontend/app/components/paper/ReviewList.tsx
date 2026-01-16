import { Review } from '@/app/types/types'
import React from 'react'
import styles from './ReviewList.module.css'
import { ReviewStatusDisplay } from '@/app/types/types';
import Link from 'next/link';
import { Chip } from '@mui/material';

interface Props {
    reviews: Review[];
}

const ReviewList = ({ reviews }: Props) => {
    const showReviewersAndGrades = reviews.some(review => review.reviewer);

    const getStatusColor = (status: number) => {
        // Map ReviewStatus enum/numbers to colors if needed
        return 'default';
    };

    return (
        <div style={{ marginBottom: '32px' }}>
            <h2 style={{ marginBottom: '16px' }}>Twoje recenzje</h2>

            {reviews.length === 0 ? (
                <div className={styles.emptyState}>
                    Brak recenzji to wyświetlenia
                </div>
            ) : (
                <div className={styles.listContainer}>
                    {reviews.map((review, index) => (
                        <div key={index} className={styles.card}>
                            <div className={styles.mainInfo}>
                                <Link href={`/myspace/papers/${review.paper?.id}`} className={styles.paperTitle}>
                                    {review.paper?.title}
                                </Link>
                                {showReviewersAndGrades && (
                                    <div className={styles.reviewerInfo}>
                                        Recenzent: {review.reviewer?.first_name} {review.reviewer?.last_name} ({review.reviewer?.username})
                                    </div>
                                )}
                            </div>

                            <div className={styles.metaInfo}>
                                <Chip
                                    label={ReviewStatusDisplay[review.status]}
                                    size="small"
                                    sx={{ color: 'white' }}
                                    variant="outlined"
                                />
                                {showReviewersAndGrades && (
                                    <div className={styles.grade}>
                                        {review.grade == 0 ? "-" : (Math.round(review.grade * 2) / 2).toFixed(2)}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ReviewList
