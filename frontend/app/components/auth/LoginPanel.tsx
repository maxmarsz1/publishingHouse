'use client'

import React, { useState } from 'react'

import InputLine from './InputLine'
import styles from './LoginPanel.module.css'
import { Button } from '@mui/material'
import Link from 'next/link'

const LoginPanel = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

  return (
    <div className={styles.panel}>
        <h2 className={styles.title}>Logowanie</h2>
        <InputLine text="Login" fieldId='username' value={username} setValue={setUsername}/>
        <InputLine text="Hasło" fieldId='password' value={password} setValue={setPassword} isPassword/>
        <Button variant='contained' fullWidth>Zaloguj się</Button>
        <div className={styles.noAccount}>
            Nie masz konta?&nbsp;
            <Link href="/auth/register" className={styles.link}>Zarejestruj się</Link>
        </div>
    </div>
  )
}

export default LoginPanel