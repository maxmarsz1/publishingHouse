import React from 'react'

import { Article } from '@/app/types/types'
import { getArticleData } from '@/app/utils/article-helper'
import styles from './page.module.css'
import ArticleData from '@/app/components/article/ArticleData'
import ArticleReviewers from '@/app/components/article/ArticleReviewers'


interface Props{
  params: {
    article_id: string
  }
}

const ArticleView = async ({params}: Props) => {
  const { article_id } = await params;
  const idAsNumber = +article_id; 
  if (isNaN(idAsNumber) || !idAsNumber) {
    console.error(`Invalid article_id provided: ${article_id}`);
  }

  const article: Article = await getArticleData(idAsNumber);
  const hasReviewers = article.reviews && article.reviews.length > 0;
  
  return (
    <>
      <h1 className={styles.title}>Przegląd artykułu</h1>

      <ArticleData article={article}/>
      {hasReviewers  && article.reviews &&
        <ArticleReviewers reviews={article.reviews} />
      }
    </>
  )
}

export default ArticleView