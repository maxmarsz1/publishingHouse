import React from 'react'

import styles from './Modal.module.css'
import Backdrop from '../general/Backdrop'
import { Button, TextField } from '@mui/material'



const JoinPublisherModal = ({setShowModal}: {setShowModal: React.Dispatch<React.SetStateAction<boolean>>}) => {
  function cancel(){
    setShowModal(false);
  }
  
  return (
    <>
      <Backdrop />
      <div className={styles.modal}>
        <h2>Dolacz do wydawnictwa</h2>
        <div className={styles.input}>
          <span>Kod: </span>
          <TextField variant='standard' style={{width: "100%"}}/>
        </div>
        <div className={styles.buttons}>
          <Button variant='outlined' onClick={cancel}>Anuluj</Button>
          <Button variant='contained'>Dołącz</Button>
        </div>
      </div>
    </>
  )
}

export default JoinPublisherModal