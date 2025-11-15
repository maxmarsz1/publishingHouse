import React from 'react'

import { Article } from '@/app/types/types'
import { getArticleData } from '@/app/utils/article-helper'
import styles from './page.module.css'
import ArticleData from '@/app/components/article/ArticleData'
import ArticleReviews from '@/app/components/article/ArticleReviews'
import { isUserStaff } from '@/app/utils/auth-server-helper'
import ArticleReviewerInfo from '@/app/components/article/ArticleReviewerInfo'


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
  const isStaff = await isUserStaff();

  const article: Article = await getArticleData(idAsNumber);
  
  return (
    <>
      <h1 className={styles.title}>Przegląd artykułu</h1>

      <ArticleData article={article} isStaff={isStaff}/>
      {article.reviews && article.reviews.length > 0 &&
        <ArticleReviews reviews={article.reviews} />
      }
      {article.review && 
        <ArticleReviewerInfo review={article.review} />
      }
    </>
  )
}

export default ArticleView