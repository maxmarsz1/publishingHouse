import React from 'react'

import ArticleTable from '@/app/components/article/ArticleTable'
import { getUserArticles } from '@/app/utils/article-helper'
import { UserArticles } from '@/app/types/types'
import ReviewsTable from '@/app/components/article/ReviewsTable'

const Articles = async () => {
  const userArticles: UserArticles = await getUserArticles();
  console.log(userArticles)

  return (
    <>
      <h1 style={{marginBottom: "8px"}}>Twoje raporty</h1>

      <ArticleTable title={"Wysłane raporty"} showPublisher={true} articles={userArticles.authored_articles}></ArticleTable>
      <ReviewsTable reviews={userArticles.user_reviews}/>
    </>
  )
}

export default Articles