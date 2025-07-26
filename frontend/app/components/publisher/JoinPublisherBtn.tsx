'use client'

import React, { useState } from 'react'
import { Button } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome' 
import { faPlus } from '@fortawesome/free-solid-svg-icons'

import styles from './JoinPublisherBtn.module.css'
import JoinPublisherModal from './JoinPublisherModal'



const JoinPublisherBtn = () => {
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
            <JoinPublisherModal setShowModal={setShowModal}/>
        )}
        
    </>
  )
}

export default JoinPublisherBtn