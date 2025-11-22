'use client'

import React, { useEffect, useState } from 'react'

import ArticleTable from '@/app/components/article/ArticleTable'
import { getUserArticles } from '@/app/utils/article-helper'
import { UserArticles } from '@/app/types/types'
import ReviewsTable from '@/app/components/article/ReviewsTable'

const Articles = () => {
  const [userArticles, setUserArticles] = useState<UserArticles | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserArticles()
        console.log(data)
        setUserArticles(data)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return <div>Ładowanie...</div>
  }

  if (!userArticles) {
    return null
  }

  return (
    <>
      <h1 style={{marginBottom: "8px"}}>Twoje raporty</h1>

      <ArticleTable 
        title={"Wysłane raporty"} 
        showPublisher={true} 
        articles={userArticles.authored_articles}
      />
      <ReviewsTable reviews={userArticles.user_reviews}/>
    </>
  )
}

export default Articles