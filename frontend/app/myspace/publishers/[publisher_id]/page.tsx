import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { Button } from '@mui/material'
import Link from 'next/link'

import ArticleTable from '@/app/components/article/ArticleTable'
import { getAdminPublisherArticles, getUserArticles } from '@/app/utils/article-helper'
import { getPublisherData } from '@/app/utils/publisher-helper'


interface Props {
  params: { publisher_id: string };
}

const PublisherView = async ({ params }: Props) => {
  const { publisher_id } = await params;
  const is_staff = false;
  
  const publisher = getPublisherData(+publisher_id);
  const adminArticles = is_staff ? getAdminPublisherArticles(publisher) : null;
  const regularUserArticles = !is_staff ? getUserArticles(publisher) : null;

  return (
    <>
      <div>
        <h1 style={{marginBottom: "8px"}}>Wydawnictwo "{publisher.name}" ({publisher.id})</h1>
        <p style={{marginBottom: "32px"}}>{publisher.description}</p>
        <Button style={{gap: "8px"}} variant='contained' href={`/myspace/publishers/${publisher.id}/new-article`} component={Link}>
          Przeslij raport
          <FontAwesomeIcon icon={faPlus}/>
        </Button>
      </div>

      {adminArticles && 
        <ArticleTable title={"Wszystkie raporty"} articles={adminArticles} admin={true}></ArticleTable>
      }
      {regularUserArticles && 
        <>
          <ArticleTable title={"Twoje raporty"} articles={regularUserArticles.authored_articles}></ArticleTable>
          <ArticleTable title={"Raporty do recenzji"} articles={regularUserArticles.articles_to_review}></ArticleTable>
        </>
      }
    </>
  )
}

export default PublisherView