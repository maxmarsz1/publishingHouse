import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { Button } from '@mui/material'
import Link from 'next/link'

import ArticleTable from '@/app/components/article/ArticleTable'
import { getAdminPublisherArticles, getUserPublisherArticles } from '@/app/utils/article-helper'
import { getPublisherData } from '@/app/utils/publisher-helper'
import { Article, UserArticles } from '@/app/types/types'


interface Props {
  params: { publisher_id: string };
}

const PublisherView = async ({ params }: Props) => {
  const { publisher_id } = await params;
  const is_staff = false;
  let publisherArticles: Article[] = [];
  let userArticles: UserArticles = { authored_articles: [], articles_to_review: [] };
  
  const publisher = getPublisherData(+publisher_id);
  if (is_staff){
    publisherArticles = getAdminPublisherArticles(publisher);
  } else {
    userArticles = getUserPublisherArticles(publisher);
  }

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

      {is_staff && 
        <ArticleTable title={"Wszystkie raporty"} articles={publisherArticles} admin={true}></ArticleTable>
      }
      {!is_staff && 
        <>
          <ArticleTable title={"Twoje raporty"} articles={userArticles.authored_articles}></ArticleTable>
          <ArticleTable title={"Raporty do recenzji"} articles={userArticles.articles_to_review}></ArticleTable>
        </>
      }
    </div>
  )
}

export default PublisherView