'use client'

import React, { useState } from 'react'
import { Publisher } from '../../types/types'
import MagazineCard from './MagazineCard'
import styles from './MagazineContainer.module.css'
import JoinMagazineBtn from './JoinMagazineBtn'
import NewMagazineBtn from './NewMagazineBtn'

const MagazineContainer = ({publishers, isStaff}: {publishers: Publisher[], isStaff: boolean}) => {
  const [publishersState, setPublishersState] = useState<Publisher[]>(publishers);
  const headerText = isStaff ? "Wszystkie czasopisma" : "Twoje czasopisma"
  return (
    <>
      <h1>{headerText}</h1>
      <div className={styles.publishersContainer}>
        {isStaff ? <NewMagazineBtn setPublishersState={setPublishersState} /> : <JoinMagazineBtn setPublishersState={setPublishersState} />}
        
        {publishersState.map((publisher) => (
          <MagazineCard key={publisher.id} publisher={publisher}/>
        ))}
      </div>
    </>
  )
}

export default MagazineContainer