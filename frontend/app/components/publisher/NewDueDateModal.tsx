'use client'

import React from 'react'
import Backdrop from '../general/Backdrop'
import { Button, TextField } from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';


import styles from './Modal.module.css'

const NewDueDateModal = ({setShowModal}: {setShowModal: React.Dispatch<React.SetStateAction<boolean>>}) => {
    function cancel(){
        setShowModal(false);
      }
      
      return (
        <>
          <Backdrop />
          <div className={styles.modal}>
            <h2>Zmień termin oddania</h2>
            <div className={styles.input}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker className={styles.datetimeInput} format="DD/MM/YYYY HH:mm" />
                </LocalizationProvider>
            </div>
            <div className={styles.buttons}>
              <Button variant='outlined' onClick={cancel}>Anuluj</Button>
              <Button variant='contained'>Zmień</Button>
            </div>
          </div>
        </>
      )
}

export default NewDueDateModal