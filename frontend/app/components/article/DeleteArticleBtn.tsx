'use client'

import { deleteArticle } from '@/app/utils/article-helper';
import { Button } from '@mui/material';
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useUI } from '@/app/context/UIContext';

const DeleteArticleBtn = ({ articleId }: { articleId: number }) => {
    const router = useRouter();
    const { showConfirm, showSnackbar } = useUI();

    function handleDelete() {
        showConfirm(
            "Jesteś pewien?",
            "Ta akcja jest nieodwracalna",
            async () => {
                try {
                    await deleteArticle(articleId);
                    showSnackbar("Artykuł usunięty pomyślnie", "success");
                    router.push("/myspace/magazines");
                }
                catch (error) {
                    console.error("Error deleting article:", error);
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

export default DeleteArticleBtn