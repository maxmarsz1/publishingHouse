import Link from 'next/link'
import React from 'react'
import styles from "./Navbar.module.css"
import { Container } from '@mui/material'
import Image from 'next/image'
import MobileMenu from './MobileMenu'

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <Container className={styles.navbarContainer}>
        <div className={styles.leftLinks}>
          <Link href='/myspace/'>
            <Image alt='logo' src="/logo.webp" width={128} height={44} className={styles.logo}/>
          </Link>
          <Link className={styles.desktopLink} href="/myspace/publishers">Wydawnictwa</Link>
          <Link className={styles.desktopLink} href="/myspace/articles">Raporty</Link>
          <Link className={styles.desktopLink} href="/myspace/account">Konto</Link>
        </div>
        <Link href="/auth/logout" className={styles.logoutLink}>Wyloguj się</Link>
        <MobileMenu/>
      </Container>
    </nav>

  )
}

export default Navbar