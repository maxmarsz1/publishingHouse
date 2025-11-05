import React from 'react'
import { Publisher } from '../../types/types'
import PublisherCard from './PublisherCard'
import styles from './PublishersContainer.module.css'
import JoinPublisherBtn from './JoinPublisherBtn'
import NewPublisherBtn from './NewPublisherBtn'
import { isUserStaff } from '@/app/utils/auth-server-helper'

const PublishersContainer: React.FC<{publishers: Publisher[]}> = async ({publishers}) => {
  const isStaff = await isUserStaff();
  const headerText = isStaff ? "Wszystkie wydawnictwa" : "Twoje wydawnictwa"
  return (
    <>
      <h1>{headerText}</h1>
      <div className={styles.publishersContainer}>
        {isStaff ? <NewPublisherBtn /> : <JoinPublisherBtn />}
        
        {publishers.map((publisher) => (
          <PublisherCard key={publisher.id} publisher={publisher}/>
        ))}
      </div>
    </>
  )
}

export default PublishersContainer