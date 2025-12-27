'use client'

import { Button } from '@mui/material';
import React from 'react'
import styles from './PaperReviewInvited.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { answearReviewInvite } from '@/app/utils/paper-helper';
import { ReviewStatus } from '@/app/types/types';

interface PaperReviewInvitedProps {
    reviewId: number;
    setReviewStatus: React.Dispatch<React.SetStateAction<ReviewStatus | null>>;
}

const PaperReviewInvited = ({ reviewId, setReviewStatus }: PaperReviewInvitedProps) => {
    async function handleAnswear(accept: boolean) {
        try {
            await answearReviewInvite(reviewId, accept);
            setReviewStatus(accept ? ReviewStatus.Pending : ReviewStatus.InviteRejected);
        }
        catch (error) {
            console.error("Error answering review invite:", error);
        }
    }

    return (
        <div className={styles.container}>
            <h4>Czy przyjmujesz zaproszenie do recenzji artykułu?</h4>
            <div className={styles.btns}>
                <Button variant='outlined' color='error' onClick={() => handleAnswear(false)}>
                    Odrzuć&nbsp;
                    <FontAwesomeIcon icon={faXmark} />
                </Button>
                <Button variant='contained' color='success' onClick={() => handleAnswear(true)}>
                    Zaakceptuj&nbsp;
                    <FontAwesomeIcon icon={faCheck} />
                </Button>
            </div>
        </div>
    )
}

export default PaperReviewInvited