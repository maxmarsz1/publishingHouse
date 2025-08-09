'use client'

import React, { useState } from 'react'
import InputLine from './InputLine'
import styles from './AuthPanel.module.css'
import { Button } from '@mui/material'
import Link from 'next/link'

interface Props {
    mode: string
}

const AuthPanel = ({ mode }: Props) => {
  const isLogin = mode === 'login'
  const title = isLogin ? 'Logowanie' : 'Rejestracja'
  const buttonText = isLogin ? 'Zaloguj się' : 'Zarejestruj się'
  const linkHref = isLogin ? '/auth/register' : '/auth/login'
  const linkText = isLogin ? 'Zarejestruj się' : 'Zaloguj się'

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [password1, setPassword1] = useState("") // Only for registration

  return (
    <div className={styles.panel}>
      <h2 className={styles.title}>{title}</h2>
      <InputLine text="Login" fieldId='username' value={username} setValue={setUsername}/>
      <InputLine text="Hasło" fieldId='password' value={password} setValue={setPassword} isPassword/>
      {!isLogin && (
        <InputLine text="Powtórz" fieldId='password1' value={password1} setValue={setPassword1} isPassword/>
      )}
      <Button variant='contained' fullWidth>{buttonText}</Button>
      <div className={styles.account}>
        {isLogin ? 'Nie masz konta?' : 'Masz już konto?'}&nbsp;
        <Link href={linkHref} className={styles.link}>{linkText}</Link>
      </div>
    </div>
  )
}

export default AuthPanel