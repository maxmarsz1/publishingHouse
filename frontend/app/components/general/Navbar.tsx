'use client'

import Link from 'next/link'
import React, { useContext } from 'react'
import styles from "./Navbar.module.css"
import { Container } from '@mui/material'
import Image from 'next/image'
import MobileMenu from './MobileMenu'
import { UserContext } from '@/app/context/UserContext'

const Navbar = () => {
  const { isStaff, logoutUser } = useContext(UserContext);

  return (
    <nav className={styles.navbar}>
      <Container className={styles.navbarContainer}>
        <div className={styles.leftLinks}>
          <Link href='/myspace/'>
            <Image alt='logo' src="/logo.webp" width={128} height={44} className={styles.logo} />
          </Link>
          <Link className={styles.desktopLink} href="/myspace/magazines">Czasopisma</Link>
          {!isStaff &&
            <Link className={styles.desktopLink} href="/myspace/papers">Twoje Raporty</Link>
          }
          <Link className={styles.desktopLink} href="/myspace/account">Konto</Link>
          {isStaff &&
            <Link className={styles.desktopLink} href="/myspace/settings">Ustawienia</Link>
          }
        </div>
        <a
          className={styles.logoutLink}
          onClick={logoutUser}
        >
          Wyloguj się
        </a>
        <MobileMenu />
      </Container>
    </nav>

  )
}

export default Navbar