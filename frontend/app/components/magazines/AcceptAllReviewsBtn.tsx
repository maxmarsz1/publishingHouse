import React, { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckDouble } from "@fortawesome/free-solid-svg-icons";
import apiClient from "@/app/utils/api-client";
import styles from "./AdminActions.module.css";
import { useUI } from "@/app/context/UIContext";

interface AcceptAllReviewsBtnProps {
    publisherId: number;
}

const AcceptAllReviewsBtn: React.FC<AcceptAllReviewsBtnProps> = ({ publisherId }) => {
    const [loading, setLoading] = useState(false);
    const { showConfirm, showSnackbar } = useUI();

    const handleAcceptAll = async () => {
        showConfirm(
            "Zatwierdzić wszystkie recenzje?",
            "Czy na pewno chcesz zatwierdzić wszystkie przesłane recenzje? Tej operacji nie można cofnąć.",
            async () => {
                setLoading(true);
                try {
                    const response = await apiClient.post(`/publisher/${publisherId}/accept-all-reviews/`);
                    showSnackbar(response.data.message, "success");
                } catch (error: any) {
                    console.error("Error accepting reviews:", error);
                    // Global interceptor handles generic errors, but we can be specific if needed.
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
            onClick={handleAcceptAll}
            disabled={loading}
            className={styles.button}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <FontAwesomeIcon icon={faCheckDouble} style={{ fontSize: '14px' }} />}
        >
            {loading ? "Przetwarzanie..." : "Zatwierdź wszystkie recenzje"}
        </Button>
    );
};

export default AcceptAllReviewsBtn;
