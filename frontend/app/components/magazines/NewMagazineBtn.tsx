'use client'

import React, { useState } from 'react'
import { Button } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome' 
import { faPlus } from '@fortawesome/free-solid-svg-icons'

import styles from './Btn.module.css'
import NewMagazineModal from './NewMagazineModal'
import { Publisher } from '@/app/types/types'



const NewMagazineBtn = ({setPublishersState}: {setPublishersState: React.Dispatch<React.SetStateAction<Publisher[]>>}) => {
    const [showModal, setShowModal] = useState(false);

    function handleClick(){
        setShowModal(!showModal);
    }

  return (
    <>
        <Button className={styles.joinBtn} variant='contained' onClick={handleClick}>
            Nowe czasopismo
            <FontAwesomeIcon icon={faPlus}/>
        </Button>
        {showModal && (
            <NewMagazineModal setShowModal={setShowModal} setPublishersState={setPublishersState}/>
        )}
        
    </>
  )
}

export default NewMagazineBtn