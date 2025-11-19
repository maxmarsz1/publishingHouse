'use client'

import React, { useState } from 'react'

import { Article, ReviewStatus } from '@/app/types/types'
import styles from './ArticleViewClient.module.css'
import ArticleData from '@/app/components/article/ArticleData'
import ArticleReviewerInfo from '@/app/components/article/ArticleReviewerInfo'
import ArticleActions from '@/app/components/article/ArticleActions'
import ArticleReviewsTable from '@/app/components/article/ArticleReviewsTable'


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
      {article.reviews &&
        <ArticleReviewsTable isAuthor={article.isAuthor} reviews={article.reviews} />
      }
      {article.review && 
        <ArticleReviewerInfo review={article.review} reviewStatus={reviewStatus} setReviewStatus={setReviewStatus!} />
      }
    </>
  )
}

export default ArticleViewClient