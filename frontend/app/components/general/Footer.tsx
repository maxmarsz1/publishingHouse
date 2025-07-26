import React from 'react'
import styles from './Footer.module.css'

const year = new Date().getFullYear();

const Footer = () => {
  return (
    <footer className={styles.footer}>
        © {year} PubHouse. Wszystkie prawa zastrzezone.
    </footer>
  )
}

export default Footer