import React from 'react'

import { Article } from '@/app/types/types'
import { getArticleData } from '@/app/utils/article-helper'
import { isUserStaff } from '@/app/utils/auth-server-helper'
import ArticleViewClient from './ArticleViewClient'

interface Props{
  params: {
    articleId: string
  }
}

const ArticleView = async ({params}: Props) => {
  const { articleId } = await params;
  const idAsNumber = +articleId; 
  if (isNaN(idAsNumber) || !idAsNumber) {
    console.error(`Invalid article_id provided: ${articleId}`);
  }

  const isStaff = await isUserStaff();
  const article: Article = await getArticleData(idAsNumber);
  
  return (
    <ArticleViewClient isStaff={isStaff} article={article} />
  )
}

export default ArticleView