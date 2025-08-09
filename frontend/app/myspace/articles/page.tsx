import React from 'react'

import ArticleTable from '@/app/components/article/ArticleTable'
import { getUserArticles, getArticlesToReview } from '@/app/utils/article-helper'

const Articles = () => {
  return (
    <div>
      <div>
        <h1 style={{marginBottom: "8px"}}>Twoje raporty</h1>
      </div>

      <ArticleTable title={"Wysłane raporty"} showPublisher={true} articles={getUserArticles()}></ArticleTable>
      <ArticleTable title={"Raporty do recenzji"} showPublisher={true} articles={getArticlesToReview()}></ArticleTable>
    </div>
  )
}

export default Articles