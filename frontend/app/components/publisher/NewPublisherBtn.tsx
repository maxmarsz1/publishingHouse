'use client'

import React, { useState } from 'react'
import { Button } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome' 
import { faPlus } from '@fortawesome/free-solid-svg-icons'

import styles from './Btn.module.css'
import NewPublisherModal from './NewPublisherModal'
import { Publisher } from '@/app/types/types'



const NewPublisherBtn = ({setPublishersState}: {setPublishersState: React.Dispatch<React.SetStateAction<Publisher[]>>}) => {
    const [showModal, setShowModal] = useState(false);

    function handleClick(){
        setShowModal(!showModal);
    }

  return (
    <>
        <Button className={styles.joinBtn} variant='contained' onClick={handleClick}>
            Nowe wydawnictwo
            <FontAwesomeIcon icon={faPlus}/>
        </Button>
        {showModal && (
            <NewPublisherModal setShowModal={setShowModal} setPublishersState={setPublishersState}/>
        )}
        
    </>
  )
}

export default NewPublisherBtn