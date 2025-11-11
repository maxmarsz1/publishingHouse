'use client'

import React, { useState } from 'react'
import { Publisher } from '../../types/types'
import PublisherCard from './PublisherCard'
import styles from './PublishersContainer.module.css'
import JoinPublisherBtn from './JoinPublisherBtn'
import NewPublisherBtn from './NewPublisherBtn'

const PublishersContainer = ({publishers, isStaff}: {publishers: Publisher[], isStaff: boolean}) => {
  const [publishersState, setPublishersState] = useState<Publisher[]>(publishers);
  const headerText = isStaff ? "Wszystkie wydawnictwa" : "Twoje wydawnictwa"
  return (
    <>
      <h1>{headerText}</h1>
      <div className={styles.publishersContainer}>
        {isStaff ? <NewPublisherBtn setPublishersState={setPublishersState} /> : <JoinPublisherBtn setPublishersState={setPublishersState} />}
        
        {publishersState.map((publisher) => (
          <PublisherCard key={publisher.id} publisher={publisher}/>
        ))}
      </div>
    </>
  )
}

export default PublishersContainer