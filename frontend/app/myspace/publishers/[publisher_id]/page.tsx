import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { Button } from '@mui/material'
import Link from 'next/link'

import ArticleTable from '@/app/components/article/ArticleTable'
import { getUserArticles, getArticlesToReview } from '@/app/utils/article-helper'
import { getPublisherData } from '@/app/utils/publisher-helper'


interface Props {
  params: { publisher_id: string };
}

const PublisherView = async ({ params }: Props) => {
  const { publisher_id } = await params;
  console.log("Publisher ID:", publisher_id);
  const publisher = getPublisherData(+publisher_id);

  return (
    <div>
      <div>
        <h1 style={{marginBottom: "8px"}}>Wydawnictwo "{publisher.name}" ({publisher.id})</h1>
        <p style={{marginBottom: "32px"}}>{publisher.description}</p>
        <Button style={{gap: "8px"}} variant='contained' href={`/myspace/publishers/${publisher.id}/new`} component={Link}>
          Przeslij raport
          <FontAwesomeIcon icon={faPlus}/>
        </Button>
      </div>

      <ArticleTable title={"Twoje raporty"} articles={getUserArticles(publisher)}></ArticleTable>
      <ArticleTable title={"Raporty do recenzji"} articles={getArticlesToReview(publisher)}></ArticleTable>
    </div>
  )
}

export default PublisherView