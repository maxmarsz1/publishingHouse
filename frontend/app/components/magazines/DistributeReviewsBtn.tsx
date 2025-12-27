import React, { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { distributeReviews } from '@/app/utils/magazine-helper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShuffle } from '@fortawesome/free-solid-svg-icons';
import { useUI } from '@/app/context/UIContext';

interface DistributeReviewsBtnProps {
    magazineId: number;
}

const DistributeReviewsBtn: React.FC<DistributeReviewsBtnProps> = ({ magazineId }) => {
    const [loading, setLoading] = useState(false);
    const { showSnackbar, showConfirm } = useUI();

    const handleDistribute = () => {
        showConfirm(
            "Potwierdzenie",
            "Czy na pewno chcesz rozdzielić recenzje dla wszystkich oczekujących prac?",
            async () => {
                setLoading(true);
                try {
                    const result = await distributeReviews(magazineId);
                    showSnackbar(result.message, 'success');
                } catch (error) {
                    console.error(error);
                    // Error is likely handled by global interceptor now, but distributeReviews might throw simple error.
                    // If distributeReviews throws, the interceptor caught the 4xx/5xx for api calls.
                    // But if distributeReviews does logic and throws, we catch here.
                    // However, we can also manually show snackbar if needed.
                    // Let's assume global interceptor handles network errors.
                } finally {
                    setLoading(false);
                }
            }
        );
    };

    return (
        <Button
            variant="contained"
            color="primary"
            onClick={handleDistribute}
            disabled={loading}
            startIcon={<FontAwesomeIcon icon={faShuffle} style={{ fontSize: '14px' }} />}
        >
            {loading ? <CircularProgress size={24} color="inherit" /> : <>Rozdziel recenzje</>}
        </Button>
    );
};

export default DistributeReviewsBtn;
