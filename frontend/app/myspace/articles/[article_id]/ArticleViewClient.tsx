'use client'

import React, { useState } from 'react'

import { Article, ReviewStatus } from '@/app/types/types'
import styles from './ArticleViewClient.module.css'
import ArticleData from '@/app/components/article/ArticleData'
import ArticleReviews from '@/app/components/article/ArticleReviews'
import ArticleReviewerInfo from '@/app/components/article/ArticleReviewerInfo'
import ArticleActions from '@/app/components/article/ArticleActions'


interface Props{
    isStaff: boolean;
    article: Article;
}

const ArticleViewClient = ({isStaff, article}: Props) => {
    const [reviewStatus, setReviewStatus] = useState<ReviewStatus | null>(article.review?.status || null);
  return (
    <>
      <h1 className={styles.title}>Przegląd artykułu</h1>

      <ArticleData article={article} isStaff={isStaff}/>
      <ArticleActions article={article} isStaff={isStaff} reviewStatus={reviewStatus}/>
      {article.reviews && article.reviews.length > 0 &&
        <ArticleReviews reviews={article.reviews} />
      }
      {article.review && 
        <ArticleReviewerInfo review={article.review} reviewStatus={reviewStatus} setReviewStatus={setReviewStatus!} />
      }
    </>
  )
}

export default ArticleViewClient