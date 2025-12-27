'use client'

import { deletePaper } from '@/app/utils/paper-helper';
import { Button } from '@mui/material';
import React from 'react'
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useUI } from '@/app/context/UIContext';

const DeletePaperBtn = ({ paperId }: { paperId: number }) => {
    const router = useRouter();
    const { showConfirm, showSnackbar } = useUI();

    function handleDelete() {
        showConfirm(
            "Jesteś pewien?",
            "Ta akcja jest nieodwracalna",
            async () => {
                try {
                    await deletePaper(paperId);
                    showSnackbar("Artykuł usunięty pomyślnie", "success");
                    router.push("/myspace/magazines");
                }
                catch (error) {
                    console.error("Error deleting paper:", error);
                }
            }
        );
    }

    return (
        <Button color='error' onClick={handleDelete} variant='contained'>
            Usuń&nbsp;
            <FontAwesomeIcon icon={faXmark} />
        </Button>
    )
}

export default DeletePaperBtn