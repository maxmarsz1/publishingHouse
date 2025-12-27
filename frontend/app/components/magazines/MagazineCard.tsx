import React from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

import styles from './MagazineCard.module.css'
import { Magazine } from '../../types/types'
import { Button } from '@mui/material'

const MagazineCard: React.FC<{ magazine: Magazine }> = ({ magazine }) => {
  return (
    <div className={styles.publisherCard}>
      <div>
        <h2>{magazine.name}</h2>
        <p>
          {magazine.description && magazine.description !== ""
            ? magazine.description
            : "Brak opisu"}
        </p>
      </div>
      <Button variant='contained' component={Link} href={`/myspace/magazines/${magazine.id}`}>Zobacz artykuły <FontAwesomeIcon icon={faArrowRight} /></Button>
    </div>
  )
}

export default MagazineCard