'use client'

import React, { useContext, useState } from 'react'
import { useRouter } from 'next/navigation'
import InputLine from './InputLine'
import styles from './AuthPanel.module.css'
import { Button } from '@mui/material'
import Link from 'next/link'
import { AxiosError } from 'axios'
import { UserContext } from '@/app/context/UserContext'
import { jwtDecode } from "jwt-decode";

interface Props {
    mode: string
}

const AuthPanel = ({ mode }: Props) => {
  const router = useRouter();
  const isLogin = mode === 'login'
  const title = isLogin ? 'Logowanie' : 'Rejestracja'
  const buttonText = isLogin ? 'Zaloguj się' : 'Zarejestruj się'
  const linkHref = isLogin ? '/auth/register' : '/auth/login'
  const linkText = isLogin ? 'Zarejestruj się' : 'Zaloguj się'

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [password2, setPassword2] = useState("") // Only for registration
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { setIsStaff } = useContext(UserContext);


  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    
    const endpointPath = isLogin ? `login/` : `register/`; 
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    
    let data: any = {
      username,
      password,
    };

    if (!isLogin) {
      if (password !== password2) {
        setError("Hasła nie pasują do siebie.");
        setLoading(false);
        return;
      }
      data = { username, password, password2, email };
    }

    try {
      const res = await fetch(`${API_BASE_URL}/auth/${endpointPath}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: 'include'
      });
      const resData = await res.json();
      console.log(`${isLogin ? 'Login' : 'Registration'} successful!`, resData);

      if (isLogin) {
        const decodeResponse = await fetch('/api/auth/decode', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
      
        if (decodeResponse.ok) {
          const { isStaff } = await decodeResponse.json();
          setIsStaff(isStaff);
        } else {
          console.error('Failed to decode access token:', await decodeResponse.json());
        }
        router.push('/myspace');
      } else {
        router.push('/auth/login'); 
      }
    } catch (err) {
      console.error(`${isLogin ? 'Login' : 'Registration'} error:`, err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Wystąpił nieoczekiwany błąd.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.panel}>
      <h2 className={styles.title}>{title}</h2>
      <InputLine text="Login" fieldId='username' value={username} setValue={setUsername}/>
      {!isLogin && (
        <InputLine text="E-mail" fieldId='email' value={email} setValue={setEmail}/>
      )}
      <InputLine text="Hasło" fieldId='password' value={password} setValue={setPassword} isPassword/>
      {!isLogin && (
        <InputLine text="Powtórz" fieldId='password2' value={password2} setValue={setPassword2} isPassword/>
      )}

      {error && <p style={{ color: 'red', marginBottom: '10px', fontSize: '14px' }}>{error}</p>}

      <Button variant='contained' fullWidth disabled={loading} onClick={handleSubmit}>
        {loading ? (isLogin ? 'Logowanie...' : 'Rejestracja...') : buttonText}
      </Button>
      <div className={styles.account}>
        {isLogin ? 'Nie masz konta?' : 'Masz już konto?'}&nbsp;
        <Link href={linkHref} className={styles.link}>{linkText}</Link>
      </div>
    </div>
  )
}

export default AuthPanel