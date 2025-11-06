import React from 'react'
import { Button } from '@mui/material'

import { Article, ArticleType, ArticleTypeDisplay, ITArticleCategory, ITArticleCategoryDisplay } from '@/app/types/types'
import styles from './ArticleData.module.css'
import Link from 'next/link'

interface Props {
    article: Article
}

const ArticleData = ({ article }: Props) => {
  return (
    <>
        <div className={styles.infoLine}><strong>Tytuł: </strong>{article.title}</div>
        <div className={styles.infoLine}><strong>Autor: </strong>{article.author.first_name} {article.author.last_name}</div>
        <div className={styles.infoLine}><strong>Wydawnictwo: </strong>{article.publisher}</div>
        <div className={styles.infoLine}><strong>Abstract: </strong>{article.abstract}</div>
        <div className={styles.infoLine}><strong>Typ artykułu: </strong>{ArticleTypeDisplay[article.articleType]}</div>
        <div className={styles.infoLine}><strong>Kategoria artykułu: </strong>{ITArticleCategoryDisplay[article.articleCategory]}</div>
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