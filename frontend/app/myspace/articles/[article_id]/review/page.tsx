import React from 'react'

import ArticleReviewForm from '@/app/components/article/ArticleReviewForm'
import { Article } from '@/app/types/types'
import { getArticleData } from '@/app/utils/article-helper'

interface Props{
    params: {
        article_id: string
    }
}

const ArticleReviewPage = async ({params}: Props) => {
    const { article_id } = await params;
    const article: Article = getArticleData(+article_id);
  return (
    <>
        <h1 style={{marginBottom: "8px"}}>Recenzja artykułu - {article.title}</h1>
        <p style={{marginBottom: "32px"}}>{article.abstract}</p>

        <ArticleReviewForm />
    </>
  )
}

export default ArticleReviewPage