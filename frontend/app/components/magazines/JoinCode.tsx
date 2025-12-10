'use client'

import { Publisher } from '@/app/types/types'
import styles from './JoinCode.module.css'
import React, { useState } from 'react'
import { Button } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotate } from '@fortawesome/free-solid-svg-icons'
import { generateNewJoinCode } from '@/app/utils/publisher-helper'
import { useUI } from '@/app/context/UIContext'

const JoinCode = ({ publisher }: { publisher: Publisher }) => {
    const [joinCode, setJoinCode] = useState(publisher.joinCode ? publisher.joinCode : "Brak");
    const [loading, setLoading] = useState(false);
    const { showSnackbar } = useUI();

    async function handleSubmit() {
        if (!publisher.id || loading) {
            return;
        }
        setLoading(true);
        try {
            const newJoinCode = await generateNewJoinCode(publisher.id);
            setJoinCode((newJoinCode));
            showSnackbar("Nowy kod dołączenia wygenerowany", "success");
        }
        catch (error) {
            console.error("Error generating new join code:", error);
            // Error managed by global interceptor, but we can log specifically
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }
    }

    return (
        <div className={styles.container}>
            <div>Kod dołączenia: <span className={styles.joinCode}>{joinCode}</span></div>
            <Button className={styles.refreshBtn} onClick={handleSubmit} disabled={loading}>
                <FontAwesomeIcon icon={faRotate} />
            </Button>
        </div>
    )
}

export default JoinCode