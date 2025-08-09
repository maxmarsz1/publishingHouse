'use client';

import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons'

import styles from './ArticleFormating.module.css'

const ArticleFormatting = () => {
    const [showInfo, setShowInfo] = useState(false);

  return (
    <div className={styles.formatingContainer}>
        <div className={styles.formatingTitle} onClick={() => setShowInfo(!showInfo)}>
            Formatowanie artykułu
            <FontAwesomeIcon icon={faCircleQuestion} className={styles.infoIcon} />
        </div>
        {showInfo &&
        <div className={styles.formatingDescription}>
            <p>
                Artykuł powinien być napisany w języku angielskim, z użyciem stylu akademickiego. 
                Poniżej znajdują się podstawowe wytyczne dotyczące formatowania:
            </p>
            <ul>
                <li>Użyj czcionki Times New Roman, rozmiar 12.</li>
                <li>Marginesy: 1 cal z każdej strony.</li>
                <li>Podwójne odstępy między wierszami.</li>
                <li>Strony powinny być ponumerowane.</li>
                <li>Bibliografia powinna być umieszczona na końcu artykułu.</li>
            </ul>
        </div>
        }
    </div>
  )
}

export default ArticleFormatting