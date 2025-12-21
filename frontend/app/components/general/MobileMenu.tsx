'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons'
import styles from "./MobileMenu.module.css"
import { useRouter } from 'next/navigation'
import { useUser } from '@/app/context/UserContext'

const MobileMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const { logoutUser, isStaff } = useUser();

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

    return (
        <div className={styles.wrapper}>
            <div className={styles.hamburger} onClick={() => setIsOpen(!isOpen)}>
                <FontAwesomeIcon icon={faBars} />
            </div>
            <div className={`${styles.menu} ${isOpen ? styles.open : ''}`}>
                <Link className={styles.mobileLink} href="/myspace/magazines" onClick={handleLinkClick}>Czasopisma</Link>
                {!isStaff &&
                    <Link className={styles.mobileLink} href="/myspace/articles" onClick={handleLinkClick}>Twoje Raporty</Link>
                }
                <Link className={styles.mobileLink} href="/myspace/account" onClick={handleLinkClick}>Konto</Link>
                {isStaff &&
                    <Link className={styles.mobileLink} href="/myspace/settings" onClick={handleLinkClick}>Ustawienia</Link>
                }
                <a className={styles.mobileLink} onClick={logoutUser}>Wyloguj się</a>
                <FontAwesomeIcon icon={faXmark} className={styles.closeIcon} onClick={() => setIsOpen(!isOpen)} />
            </div>
        </div>
    )
}

export default MobileMenu