import React from 'react'
import { Publisher } from '../types/types'
import PublisherCard from './PublisherCard'
import styles from './PublishersContainer.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { Button } from '@mui/material'

const PublishersContainer: React.FC<{publishers: Publisher[]}> = ({publishers}) => {
  return (
    <>
      <h1 style={{marginBottom: "16px"}}>Twoje wydawnictwa</h1>
      <div className={styles.publishersContainer}>
        <Button className={styles.joinBtn} variant='contained'>
          Dołącz do wydawnictwa
          <FontAwesomeIcon icon={faPlus}/>
        </Button>
        
        {publishers.map((publisher) => (
          <PublisherCard key={publisher.id} publisher={publisher}/>
        ))}
      </div>
    </>
  )
}

export default PublishersContainer