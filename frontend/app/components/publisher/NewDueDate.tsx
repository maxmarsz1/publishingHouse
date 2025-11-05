'use client'

import React, {useState} from 'react'
import { Button } from '@mui/material'
import NewDueDateModal from './NewDueDateModal';

const NewDueDate = () => {
    const [showModal, setShowModal] = useState(false);

    function handleClick(){
        setShowModal(!showModal);
    }
  return (
    <>
    <Button variant='contained' onClick={handleClick}>Nowy termin</Button>

    {showModal && (
        <NewDueDateModal setShowModal={setShowModal}/>
    )}
    </>
  )
}

export default NewDueDate