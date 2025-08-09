import React from 'react'

import styles from './AuthContainer.module.css'
import { Container } from '@mui/material'

interface ContainerProps {
    children: React.ReactNode
}

const AuthContainer = ({ children }: ContainerProps) => {
  return (
    <Container className={styles.container}>
        {children}
    </Container>
  )
}

export default AuthContainer