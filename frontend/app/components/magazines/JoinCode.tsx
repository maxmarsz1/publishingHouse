'use client'

import { Publisher } from '@/app/types/types'
import styles from './JoinCode.module.css'
import React, { useState } from 'react'
import { Button } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotate } from '@fortawesome/free-solid-svg-icons'
import { generateNewJoinCode } from '@/app/utils/publisher-helper'

const JoinCode = ({publisher}: {publisher: Publisher}) => {
    const [joinCode, setJoinCode] = useState(publisher.joinCode ? publisher.joinCode : "Brak");

    async function handleSubmit() {
        if(!publisher.id){
            return;
        }
        try{
            const newJoinCode = await generateNewJoinCode(publisher.id);
            setJoinCode((newJoinCode));
        }
        catch(error){
            console.error("Error generating new join code:", error);
        }
    }

  return (
    <div className={styles.container}>
        <div>Kod dołączenia: <span className={styles.joinCode}>{joinCode}</span></div>
        <Button className={styles.refreshBtn} onClick={handleSubmit}>
            <FontAwesomeIcon icon={faRotate} />
        </Button>
    </div>
  )
}

export default JoinCode