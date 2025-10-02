import React from 'react'
import { Button } from '@mui/material'

import { Article } from '@/app/types/types'
import styles from './ArticleData.module.css'
import Link from 'next/link'

interface Props {
    article: Article
}

const ArticleData = ({ article }: Props) => {
  return (
    <>
        <div className={styles.infoLine}><strong>Tytuł: </strong>{article.title}</div>
        <div className={styles.infoLine}><strong>Autor: </strong>{article.author.firstName} {article.author.lastName}</div>
        <div className={styles.infoLine}><strong>Wydawnictwo: </strong>{article.publisher.name}</div>
        <div className={styles.infoLine}><strong>Abstract: </strong>{article.abstract}</div>
        <div className={styles.infoLine}><strong>Typ artykułu: </strong>{article.articleType}</div>
        <div className={styles.infoLine}><strong>Kategoria artykułu: </strong>{article.articleCategory}</div>
        {article.filePath && 
          <Button className={styles.downloadBtn} variant='contained' component={Link} href={article.filePath}>Pobierz artykuł</Button>
        }
        {article.toReview &&
          <Button className={styles.reviewBtn} variant='outlined' component={Link} href={`/myspace/articles/${article.id}/review`}>Recenzuj</Button>
        }
    </>
  )
}

export default ArticleData