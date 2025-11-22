'use client'

import { deletePublisher } from '@/app/utils/publisher-helper';
import { Button } from '@mui/material';
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import ConfirmationDialog from '../general/ConfirmationDialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const DeleteMagazineBtn = ({publisherId}: {publisherId: number}) => {
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();

    async function handleConfirm(){
        try{
            await deletePublisher(publisherId);
            router.push("/myspace/magazines");
        }
        catch(error){
            console.error("Error deleting magazine:", error);
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

export default DeleteMagazineBtn