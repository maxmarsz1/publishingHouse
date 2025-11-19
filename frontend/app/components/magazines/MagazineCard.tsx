import React from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

import styles from './MagazineCard.module.css'
import { Publisher } from '../../types/types'
import { Button } from '@mui/material'

const MagazineCard: React.FC< {publisher: Publisher} > = ({publisher}) => {
  return (
    <div className={styles.publisherCard}>
      <div>
        <h2>{publisher.name}</h2>
        <p>
            {publisher.description && publisher.description !== "" 
            ? publisher.description 
            : "Brak opisu"}
        </p>
      </div>
      <Button variant='contained' component={Link} href={`/myspace/magazines/${publisher.id}`}>Zobacz raporty <FontAwesomeIcon icon={faArrowRight}/></Button>
    </div>
  )
}

export default MagazineCard