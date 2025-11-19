import React from 'react'

import ArticleReviewForm from '@/app/components/article/ArticleReviewForm'
import { Article } from '@/app/types/types'
import { getArticleData } from '@/app/utils/article-helper'

interface Props{
    params: {
        articleId: string
    }
}

const ArticleReviewPage = async ({params}: Props) => {
    const { articleId } = await params;
    const idAsNumber = +articleId; 
    if (isNaN(idAsNumber) || !idAsNumber) {
      console.error(`Invalid article_id provided: ${articleId}`);
    }
    const article: Article = await getArticleData(idAsNumber);
  return (
    <>
        <h1 style={{marginBottom: "8px"}}>Recenzja artykułu - {article.title}</h1>
        <p style={{marginBottom: "32px"}}>{article.abstract}</p>

        <ArticleReviewForm articleId={idAsNumber} />
    </>
  )
}

export default ArticleReviewPage