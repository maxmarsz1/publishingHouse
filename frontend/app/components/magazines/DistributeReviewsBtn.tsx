import React, { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { distributeReviews } from '@/app/utils/publisher-helper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShuffle } from '@fortawesome/free-solid-svg-icons';

interface DistributeReviewsBtnProps {
    publisherId: number;
}

const DistributeReviewsBtn: React.FC<DistributeReviewsBtnProps> = ({ publisherId }) => {
    const [loading, setLoading] = useState(false);

    const handleDistribute = async () => {
        if (!confirm("Czy na pewno chcesz rozdzielić recenzje dla wszystkich oczekujących raportów?")) {
            return;
        }

        setLoading(true);
        try {
            const result = await distributeReviews(publisherId);
            alert(result.message);
        } catch (error) {
            console.error(error);
            alert("Wystąpił błąd podczas rozdzielania recenzji.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            variant="contained"
            color="primary"
            onClick={handleDistribute}
            disabled={loading}
        >
            {loading ? <CircularProgress size={24} color="inherit" /> : <>Rozdziel recenzje&nbsp;<FontAwesomeIcon icon={faShuffle} /></>}
        </Button>
    );
};

export default DistributeReviewsBtn;
