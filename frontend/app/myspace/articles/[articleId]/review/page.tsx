'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import ArticleReviewForm from '@/app/components/article/ArticleReviewForm'
import { Article } from '@/app/types/types'
import { getArticleData } from '@/app/utils/article-helper'

const ArticleReviewPage = () => {
    const params = useParams()
    const [article, setArticle] = useState<Article | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const articleIdParam = params?.articleId;

    useEffect(() => {
        const fetchData = async () => {
            if (!articleIdParam || Array.isArray(articleIdParam)) {
                setIsLoading(false)
                return
            }

            const idAsNumber = +articleIdParam

            if (isNaN(idAsNumber) || !idAsNumber) {
                console.error(`Invalid article_id provided: ${articleIdParam}`)
                setIsLoading(false)
                return
            }

            try {
                const data = await getArticleData(idAsNumber)
                setArticle(data)
            } catch (error) {
                console.error(error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [articleIdParam])

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (!article || !articleIdParam || Array.isArray(articleIdParam)) {
        return null
    }

    return (
        <>
            <h1 style={{ marginBottom: "8px" }}>Recenzja artykułu - {article.title}</h1>
            <p style={{ marginBottom: "32px" }}>{article.abstract}</p>

            <ArticleReviewForm articleId={+articleIdParam} />
        </>
    )
}

export default ArticleReviewPage