import React from 'react'

import { Article } from '@/app/types/types'
import { getArticleData } from '@/app/utils/article-helper'
import styles from './page.module.css'
import ArticleData from '@/app/components/article/ArticleData'


interface Props{
  params: {
    article_id: string
  }
}

const ArticleView = async ({params}: Props) => {
  const { article_id } = await params;
  const idAsNumber = +article_id; 
  if (isNaN(idAsNumber) || !idAsNumber) {
    // ✅ FIX 2: Handle invalid or missing IDs gracefully
    console.error(`Invalid article_id provided: ${article_id}`);
  }

  const article: Article = await getArticleData(idAsNumber);
  const hasReviewers = article.reviewers && article.reviewers.length > 0;
  
  return (
    <>
      <h1 className={styles.title}>Przegląd artykułu</h1>

      <ArticleData article={article}/>
      {/* {hasReviewers &&
      
      } */}
    </>
  )
}

export default ArticleView