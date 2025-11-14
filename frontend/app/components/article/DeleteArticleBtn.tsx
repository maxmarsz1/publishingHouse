'use client'

import { deleteArticle } from '@/app/utils/article-helper-client';
import { Button } from '@mui/material';
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import ConfirmationDialog from '../general/ConfirmationDialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const DeleteArticleBtn = ({articleId}: {articleId: number}) => {
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();

    async function handleConfirm(){
        try{
            await deleteArticle(articleId);
            router.push("/myspace/publishers");
        }
        catch(error){
            console.error("Error deleting article:", error);
        }
        finally{
            setShowModal(false);
        }
    }

  return (
    <>
        <Button color='error' onClick={() => setShowModal(true)}  variant='contained'>
            Usuń&nbsp;
            <FontAwesomeIcon icon={faXmark}/>
        </Button>

        <ConfirmationDialog open={showModal} title="Jesteś pewien?" message='Ta akcja jest nieodwracalna' onCancel={() => setShowModal(false)} onConfirm={handleConfirm} />
    </>
  )
}

export default DeleteArticleBtn