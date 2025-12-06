'use client'

import React, { useContext, useState } from 'react'
import { useRouter } from 'next/navigation'
import InputLine from './InputLine'
import styles from './LoginPanel.module.css'
import { Button } from '@mui/material'
import Link from 'next/link'
import { UserContext } from '@/app/context/UserContext'
import { updateUserContext } from '@/app/utils/user-context-helper'

const LoginPanel = () => {
    const router = useRouter();

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { setIsStaff } = useContext(UserContext);


    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

        const data = {
            username,
            password,
        };

        try {
            const res = await fetch(`${API_BASE_URL}/auth/login/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
                credentials: 'include'
            });
            const resData = await res.json();

            if (res.ok) {
                console.log('Logowanie pomyślne!', resData);
                updateUserContext(setIsStaff);
                router.push('/myspace');
            } else {
                console.error('Błąd logowania:', resData);
                if (resData.detail) {
                    setError(resData.detail);
                } else if (resData.non_field_errors) {
                    setError(resData.non_field_errors.join(", "));
                } else {
                    setError("Nieprawidłowy login lub hasło.");
                }
            }

        } catch (err) {
            console.error('Błąd logowania:', err);
            setError("Wystąpił nieoczekiwany błąd serwera.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.panel}>
            <h2 className={styles.title}>Logowanie</h2>
            <InputLine text="Login" fieldId='username' value={username} setValue={setUsername} />
            <InputLine text="Hasło" fieldId='password' value={password} setValue={setPassword} isPassword />

            {error && <p style={{ color: 'red', marginBottom: '10px', fontSize: '14px' }}>{error}</p>}

            <Button variant='contained' fullWidth disabled={loading} onClick={handleSubmit}>
                {loading ? 'Logowanie...' : 'Zaloguj się'}
            </Button>
            <div className={styles.account}>
                Nie masz konta?&nbsp;
                <Link href='/auth/register' className={styles.link}>Zarejestruj się</Link>
            </div>
        </div>
    )
}

export default LoginPanel
