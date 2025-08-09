import React from 'react'

import styles from './LeftPanel.module.css'
import Image from 'next/image'

const LeftPanel = () => {
  return (
    <div className={styles.panel}>
        <Image alt='logo' src="/logo.webp" width={256} height={88} className={styles.image}/>
        <h3 className={styles.title}>Aplikacja Politechniki Krakowskiej</h3>
        <span className={styles.text}>symulująca działanie czasopisma naukowego</span>
    </div>
  )
}

export default LeftPanel