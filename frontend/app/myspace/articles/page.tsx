import React from 'react'

import ArticleTable from '@/app/components/article/ArticleTable'
import { getUserArticles } from '@/app/utils/article-helper'
import { UserArticles } from '@/app/types/types'

const Articles = () => {
  const userArticles: UserArticles = getUserArticles();

  return (
    <>
      <h1 style={{marginBottom: "8px"}}>Twoje raporty</h1>

      <ArticleTable title={"Wysłane raporty"} showPublisher={true} articles={userArticles.authored_articles}></ArticleTable>
      <ArticleTable title={"Raporty do recenzji"} showPublisher={true} articles={userArticles.articles_to_review}></ArticleTable>
    </>
  )
}

export default Articles