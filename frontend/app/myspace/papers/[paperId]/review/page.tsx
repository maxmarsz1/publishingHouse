'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import PaperReviewForm from '@/app/components/paper/PaperReviewForm'
import { Paper } from '@/app/types/types'
import { getPaperData } from '@/app/utils/paper-helper'

const PaperReviewPage = () => {
    const params = useParams()
    const [paper, setPaper] = useState<Paper | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const paperIdParam = params?.paperId;

    useEffect(() => {
        const fetchData = async () => {
            if (!paperIdParam || Array.isArray(paperIdParam)) {
                setIsLoading(false)
                return
            }

            const idAsNumber = +paperIdParam

            if (isNaN(idAsNumber) || !idAsNumber) {
                console.error(`Invalid paper_id provided: ${paperIdParam}`)
                setIsLoading(false)
                return
            }

            try {
                const data = await getPaperData(idAsNumber)
                setPaper(data)
            } catch (error) {
                console.error(error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [paperIdParam])

    if (isLoading) {
        return <div>Ładowanie...</div>
    }

    if (!paper || !paperIdParam || Array.isArray(paperIdParam)) {
        return null
    }

    return (
        <>
            <h1 style={{ marginBottom: "8px" }}>Recenzja artykułu - {paper.title}</h1>
            <p style={{ marginBottom: "32px" }}>{paper.abstract}</p>

            <PaperReviewForm paperId={+paperIdParam} />
        </>
    )
}

export default PaperReviewPage