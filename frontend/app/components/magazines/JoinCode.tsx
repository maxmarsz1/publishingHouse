'use client'

import { Magazine } from '@/app/types/types'
import styles from './JoinCode.module.css'
import React, { useState } from 'react'
import { Button } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotate } from '@fortawesome/free-solid-svg-icons'
import { generateNewJoinCode } from '@/app/utils/magazine-helper'
import { useUI } from '@/app/context/UIContext'

const JoinCode = ({ magazine }: { magazine: Magazine }) => {
    const [joinCode, setJoinCode] = useState(magazine.joinCode ? magazine.joinCode : "Brak");
    const [loading, setLoading] = useState(false);
    const { showSnackbar } = useUI();

    async function handleSubmit() {
        if (!magazine.id || loading) {
            return;
        }
        setLoading(true);
        try {
            const newJoinCode = await generateNewJoinCode(magazine.id);
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