'use client'

import React, { useState } from 'react'

import InputLine from './InputLine'
import styles from './RegisterPanel.module.css'
import { Button } from '@mui/material'
import Link from 'next/link'

const RegisterPanel = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [password1, setPassword1] = useState("")

  return (
    <div className={styles.panel}>
        <h2 className={styles.title}>Rejestracja</h2>
        <InputLine text="Login" fieldId='username' value={username} setValue={setUsername}/>
        <InputLine text="Hasło" fieldId='password' value={password} setValue={setPassword} isPassword/>
        <InputLine text="Powtórz" fieldId='password1' value={password1} setValue={setPassword1} isPassword/>
        <Button variant='contained' fullWidth>Zarejestruj się</Button>
        <div className={styles.account}>
            Masz już konto?&nbsp;
            <Link href="/auth/login" className={styles.link}>Zaloguj się</Link>
        </div>
    </div>
  )
}

export default RegisterPanel