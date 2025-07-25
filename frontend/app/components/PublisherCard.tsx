import React from 'react'
import Link from 'next/link'
import styles from './PublisherCard.module.css'
import { Publisher } from '../types/types'
import { Button } from '@mui/material'

const PublisherCard: React.FC< {publisher: Publisher} > = ({publisher}) => {
  return (
    <div className={styles.publisherCard}>
      <div>
        <h2>{publisher.name}</h2>
        <p>{publisher.description}</p>
      </div>
      <Button variant='contained' component={Link} href={`/myspace/publishers/${publisher.id}`}>Zobacz raporty</Button>
    </div>
  )
}

export default PublisherCard