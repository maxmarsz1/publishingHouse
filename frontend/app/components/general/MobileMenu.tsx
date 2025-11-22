'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons'
import styles from "./MobileMenu.module.css"
import { useRouter } from 'next/navigation'
import apiClient from '@/app/utils/api-client'
import { AxiosError } from 'axios'

const MobileMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const html = document.documentElement;
        const body = document.body;

        if (isOpen) {
            html.classList.add('no-scroll');
            body.classList.add('no-scroll');
        } else {
            html.classList.remove('no-scroll');
            body.classList.remove('no-scroll');
        }

        return () => {
            html.classList.remove('no-scroll');
            body.classList.remove('no-scroll');
        };
    }, [isOpen]);

    const handleLinkClick = () => {
        setIsOpen(false);
    };

    const handleLogout = async (e: React.MouseEvent) => {
        e.preventDefault();

        try {
        const response = await apiClient.post('/auth/logout/'); 
        
        console.log('Logout successful:', response.data);

        } catch (err) {
        console.error('Logout error:', err);
        if (err instanceof AxiosError && err.response?.status === 400) {
            console.warn("Token was already invalid or blacklisted. Proceeding with client logout.");
        }
        } finally {
        router.push('/auth/login'); 
        }
    };

  return (
    <div className={styles.wrapper}>
        <div className={styles.hamburger} onClick={() => setIsOpen(!isOpen)}>
            <FontAwesomeIcon icon={faBars}  />
        </div>
        <div className={`${styles.menu} ${isOpen ? styles.open : ''}`}>
          <Link className={styles.mobileLink} href="/myspace/publishers" onClick={handleLinkClick}>Wydawnictwa</Link>
          <Link className={styles.mobileLink} href="/myspace/articles" onClick={handleLinkClick}>Raporty</Link>
          <Link className={styles.mobileLink} href="/myspace/account" onClick={handleLinkClick}>Konto</Link>
          <Link className={styles.mobileLink} href="/auth/logout" onClick={handleLogout}>Wyloguj się</Link>
          <FontAwesomeIcon icon={faXmark} className={styles.closeIcon}  onClick={() => setIsOpen(!isOpen)}/>
        </div>
    </div>
  )
}

export default MobileMenu