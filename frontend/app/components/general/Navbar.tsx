'use client'

import Link from 'next/link'
import React from 'react'
import { useRouter } from 'next/navigation'
import styles from "./Navbar.module.css"
import { Container } from '@mui/material'
import Image from 'next/image'
import MobileMenu from './MobileMenu'
import api from '@/app/utils/api-client'
import { AxiosError } from 'axios'

const Navbar = ({isStaff}: {isStaff: boolean}) => {
  const router = useRouter();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();

    try {
      const response = await api.post('/logout/'); 
      
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
    <nav className={styles.navbar}>
      <Container className={styles.navbarContainer}>
        <div className={styles.leftLinks}>
          <Link href='/myspace/'>
            <Image alt='logo' src="/logo.webp" width={128} height={44} className={styles.logo}/>
          </Link>
          <Link className={styles.desktopLink} href="/myspace/publishers">Wydawnictwa</Link>
          {!isStaff &&
            <Link className={styles.desktopLink} href="/myspace/articles">Raporty</Link>
          }
          <Link className={styles.desktopLink} href="/myspace/account">Konto</Link>
        </div>
        <a 
          href="/auth/logout"
          className={styles.logoutLink}
          onClick={handleLogout}
        >
          Wyloguj się
        </a>
        <MobileMenu/>
      </Container>
    </nav>

  )
}

export default Navbar