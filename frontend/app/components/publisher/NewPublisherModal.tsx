'use client'

import React from 'react'
import Backdrop from '../general/Backdrop'
import { Button, TextField } from '@mui/material'

import styles from './Modal.module.css'

const NewPublisherModal = ({setShowModal}: {setShowModal: React.Dispatch<React.SetStateAction<boolean>>}) => {
    function cancel(){
        setShowModal(false);
      }
      
      return (
        <>
          <Backdrop />
          <div className={styles.modal}>
            <h2>Stwórz nowe wydawnictwo</h2>
            <div className={styles.input}>
              <span>Nazwa: </span>
              <TextField variant='standard' style={{width: "100%"}}/>
            </div>
            <div className={styles.input}>
              <span>Opis: </span>
              <TextField variant='standard' style={{width: "100%"}}/>
            </div>
            <div className={styles.buttons}>
              <Button variant='outlined' onClick={cancel}>Anuluj</Button>
              <Button variant='contained'>Stwórz</Button>
            </div>
          </div>
        </>
      )
}

export default NewPublisherModal