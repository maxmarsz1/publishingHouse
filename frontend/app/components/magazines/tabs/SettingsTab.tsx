'use client';

import { deleteMagazine } from '@/app/utils/magazine-helper';
import { Button } from '@mui/material';
import React from 'react'
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useUI } from '@/app/context/UIContext';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const SettingsTab = ({ magazineId }: { magazineId: number }) => {
    const router = useRouter();
    const { showConfirm, showSnackbar } = useUI();

    function handleDelete() {
        showConfirm(
            "Jesteś pewien?",
            "Ta akcja jest nieodwracalna. Usunięcie czasopisma spowoduje usunięcie wszystkich powiązanych danych.",
            async () => {
                try {
                    await deleteMagazine(magazineId);
                    showSnackbar("Czasopismo usunięte pomyślnie", "success")
                    router.push("/myspace/magazines");
                }
                catch (error) {
                    console.error("Error deleting magazine:", error);
                }
            }
        );
    }

    return (
        <div style={{ padding: '20px 0' }}>
            <div style={{ marginBottom: '16px' }}>
                <h3>Strefa niebezpieczna</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    Te operacje są nieodwracalne.
                </p>
            </div>
            <Button
                color='error'
                onClick={handleDelete}
                variant='contained'
                startIcon={<FontAwesomeIcon icon={faXmark} style={{ fontSize: '14px' }} />}
            >
                Usuń czasopismo
            </Button>
        </div>
    )
}

export default SettingsTab;
