'use client'

import React, { useState } from 'react'
import { Button } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome' 
import { faPlus } from '@fortawesome/free-solid-svg-icons'

import styles from './Btn.module.css'
import JoinPublisherModal from './JoinPublisherModal'
import { Publisher } from '@/app/types/types'



const JoinPublisherBtn = ({setPublishersState}: {setPublishersState: React.Dispatch<React.SetStateAction<Publisher[]>>}) => {
    const [showModal, setShowModal] = useState(false);

    function handleClick(){
        setShowModal(!showModal);
    }

  return (
    <>
        <Button className={styles.joinBtn} variant='contained' onClick={handleClick}>
            Dołącz do wydawnictwa
            <FontAwesomeIcon icon={faPlus}/>
        </Button>
        {showModal && (
            <JoinPublisherModal setShowModal={setShowModal} setPublishersState={setPublishersState}/>
        )}
        
    </>
  )
}

export default JoinPublisherBtn