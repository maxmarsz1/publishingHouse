'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/app/utils/api-client'
import InputLine from './InputLine'
import styles from './AuthPanel.module.css'
import { Button } from '@mui/material'
import Link from 'next/link'
import { AxiosError } from 'axios'

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


  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    
    const endpointPath = isLogin ? `/login/` : `/register/`; 
    
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
      const response = await api.post(endpointPath, data); 
      console.log(`${isLogin ? 'Login' : 'Registration'} successful!`, response.data);

      if (isLogin) {
        // alert('Zalogowano pomyślnie!');
        // 💡 You should now redirect the user or update application state.
        router.push('/myspace');
      } else {
        // alert('Rejestracja pomyślna! Teraz możesz się zalogować.');
        router.push('/auth/login'); 
      }
    } catch (err) {
      console.error('API Error:', err);
      if (err instanceof AxiosError && err.response) {
        const errorData = err.response.data;
        console.log(err.response.data)
        
        let errorMessage = "Wystąpił błąd.";
        if (errorData.detail) {
            errorMessage = errorData.detail; // Common for JWT errors
        } else if (errorData.username) {
            errorMessage = `Login: ${errorData.username.join(' ')}`; // Common for validation errors
        } else if (errorData.password) {
            errorMessage = `Hasło: ${errorData.password.join(' ')}`;
        } else if (errorData.email) {
            errorMessage = `Email: ${errorData.email.join(' ')}`;
        }
        
        setError(`Błąd: ${errorMessage}`);

      } else {
        setError("Wystąpił nieznany błąd podczas komunikacji z serwerem.");
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