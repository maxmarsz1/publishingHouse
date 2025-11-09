'use client'

import React, {useState} from 'react'
import { Button } from '@mui/material'
import NewDueDateModal from './NewDueDateModal';
import { Publisher } from '@/app/types/types';

const NewDueDateBtn = ({publisher}: {publisher: Publisher}) => {
    const [showModal, setShowModal] = useState(false);

    function handleClick(){
        setShowModal(!showModal);
    }
  return (
    <>
    <Button variant='contained' onClick={handleClick}>Nowy termin</Button>

    {showModal && (
        <NewDueDateModal setShowModal={setShowModal} publisher={publisher}/>
    )}
    </>
  )
}

export default NewDueDateBtn