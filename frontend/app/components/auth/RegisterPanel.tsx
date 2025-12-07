'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import InputLine from './InputLine'
import styles from './RegisterPanel.module.css'
import { Button } from '@mui/material'
import Link from 'next/link'
import Image from 'next/image'

const RegisterPanel = () => {
    const router = useRouter();

    const [username, setUsername] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<Record<string, string[]>>({})

    const handleSubmit = async () => {
        setLoading(true);
        setErrors({});

        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

        if (password !== password2) {
            setErrors({ password: ["Hasła nie pasują do siebie."] });
            setLoading(false);
            return;
        }
        const data = { username, password, password2, email, first_name: firstName, last_name: lastName };

        try {
            const res = await fetch(`${API_BASE_URL}/auth/register/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
                credentials: 'include'
            });
            const resData = await res.json();

            if (!res.ok) {
                setErrors(resData);
                console.error('Rejestracja nie powiodła się!', resData);
            } else {
                console.log('Rejestracja powiodła się!', resData);
                router.push('/auth/login');
            }

        } catch (err) {
            console.error('Rejestracja nie powiodła się!', err);
            setErrors({ non_field_errors: ["Wystąpił nieoczekiwany błąd serwera."] });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.panel}>
            <Link href="/">
                <Image src="/logo.webp" alt="Logo" width={256} height={88} />
            </Link>
            <h2 className={styles.title}>Rejestracja</h2>

            {errors.non_field_errors && (
                <div style={{ color: 'red', marginBottom: '10px', fontSize: '14px', textAlign: 'center' }}>
                    {errors.non_field_errors.join(", ")}
                </div>
            )}

            <div className={styles.inputContainer}>
                <InputLine
                    text="Imię"
                    fieldId='firstName'
                    value={firstName}
                    setValue={setFirstName}
                    column
                    error={!!errors.first_name}
                    helperText={errors.first_name?.join(", ")}
                />
                <InputLine
                    text="Nazwisko"
                    fieldId='lastName'
                    value={lastName}
                    setValue={setLastName}
                    column
                    error={!!errors.last_name}
                    helperText={errors.last_name?.join(", ")}
                />
                <InputLine
                    text="Login"
                    fieldId='username'
                    value={username}
                    setValue={setUsername}
                    column
                    error={!!errors.username}
                    helperText={errors.username?.join(", ")}
                />
                <InputLine
                    text="E-mail"
                    fieldId='email'
                    value={email}
                    setValue={setEmail}
                    column
                    error={!!errors.email}
                    helperText={errors.email?.join(", ")}
                />
                <InputLine
                    text="Hasło"
                    fieldId='password'
                    value={password}
                    setValue={setPassword}
                    isPassword
                    column
                    error={!!errors.password}
                    helperText={errors.password?.join(", ")}
                />
                <InputLine
                    text="Powtórz hasło"
                    fieldId='password2'
                    value={password2}
                    setValue={setPassword2}
                    isPassword
                    column
                    error={!!errors.password2}
                    helperText={errors.password2?.join(", ")}
                />
            </div>


            <Button variant='contained' disabled={loading} onClick={handleSubmit}>
                {loading ? 'Rejestrowanie...' : 'Zarejestruj się'}
            </Button>
            <div className={styles.account}>
                Masz już konto?&nbsp;
                <Link href="/auth/login" className={styles.link}>Zaloguj się</Link>
            </div>
        </div>
    )
}

export default RegisterPanel
