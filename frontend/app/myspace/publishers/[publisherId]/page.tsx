import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { Button } from '@mui/material'
import Link from 'next/link'

import ArticleTable from '@/app/components/article/ArticleTable'
import { getAdminPublisherArticles, getUserPublisherArticles } from '@/app/utils/article-helper'
import { getPublisherData } from '@/app/utils/publisher-helper'
import { isUserStaff } from '@/app/utils/auth-server-helper'
import NewDueDate from '@/app/components/publisher/NewDueDate'


interface Props {
  params: { publisher_id: string };
}

const PublisherView = async ({ params }: Props) => {
  const { publisher_id } = await params;

  const isStaff = await isUserStaff();
  
  const publisher = await getPublisherData(+publisher_id);
  let dueDate = null;
  if(!isStaff && publisher.dueDate){
    dueDate = new Date(publisher.dueDate);
  }
  const pastDue = dueDate ? (new Date() > dueDate) : false;


  const adminArticles = isStaff ? await getAdminPublisherArticles(publisher.id) : null;
  const regularUserArticles = !isStaff ? await getUserPublisherArticles(publisher.id) : null;

  return (
    <>
      <div>
        <h1 style={{marginBottom: "8px"}}>Wydawnictwo "{publisher.name}" ({publisher.id})</h1>
        <p style={{marginBottom: "32px"}}>{publisher.description}</p>

        {!pastDue && !isStaff &&
          <Button style={{gap: "8px"}} variant='contained' href={`/myspace/publishers/${publisher.id}/new-article`} component={Link}>
            Przeslij raport
            <FontAwesomeIcon icon={faPlus}/>
          </Button>
        }
        {isStaff && <>
          <NewDueDate/>
          {/* <div>Generuj nowy kod dołączenia</div> */}
        </>}
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