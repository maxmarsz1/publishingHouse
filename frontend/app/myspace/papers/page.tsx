'use client'

import React, { useEffect, useState } from 'react'
import PaperList from '@/app/components/paper/PaperList'
import ReviewList from '@/app/components/paper/ReviewList'
import { getUserPapers } from '@/app/utils/paper-helper'
import { UserPapers } from '@/app/types/types'

const Papers = () => {
  const [userPapers, setUserPapers] = useState<UserPapers | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserPapers()
        console.log(data)
        setUserPapers(data)
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

  if (!userPapers) {
    return null
  }

  return (
    <>
      <h1 style={{ marginBottom: "8px" }}>Twoje artykuły</h1>

      <PaperList
        title={"Wysłane artykuły"}
        showMagazine={true}
        papers={userPapers.authored_papers}
      />
      <ReviewList reviews={userPapers.user_reviews} />
    </>
  )
}

export default Papers