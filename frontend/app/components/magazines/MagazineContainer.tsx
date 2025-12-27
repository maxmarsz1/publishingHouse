'use client'

import React, { useContext, useState } from 'react'
import { Magazine } from '../../types/types'
import MagazineCard from './MagazineCard'
import styles from './MagazineContainer.module.css'
import JoinMagazineBtn from './JoinMagazineBtn'
import NewMagazineBtn from './NewMagazineBtn'
import { UserContext } from '@/app/context/UserContext'

const MagazineContainer = ({ magazines }: { magazines: Magazine[] }) => {
  const { isStaff } = useContext(UserContext);
  const [magazinesState, setMagazinesState] = useState<Magazine[]>(magazines);
  const headerText = isStaff ? "Wszystkie czasopisma" : "Twoje czasopisma"
  return (
    <>
      <h1>{headerText}</h1>
      <div className={styles.publishersContainer}>
        {isStaff ? <NewMagazineBtn setMagazinesState={setMagazinesState} /> : <JoinMagazineBtn setMagazinesState={setMagazinesState} />}

        {magazinesState.map((magazine) => (
          <MagazineCard key={magazine.id} magazine={magazine} />
        ))}
      </div>
    </>
  )
}

export default MagazineContainer