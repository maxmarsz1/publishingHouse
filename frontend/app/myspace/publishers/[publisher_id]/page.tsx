import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { Button } from '@mui/material'
import Link from 'next/link'

import ArticleTable from '@/app/components/article/ArticleTable'
import { getAdminPublisherArticles, getUserPublisherArticles } from '@/app/utils/article-helper'
import { getPublisherData } from '@/app/utils/publisher-helper'
import { isUserStaff } from '@/app/utils/auth-server-helper'
import NewDueDateBtn from '@/app/components/publisher/NewDueDateBtn'
import DeletePublisherBtn from '@/app/components/publisher/DeletePublisherBtn'
import AdminActions from '@/app/components/publisher/AdminActions'


interface Props {
  params: { publisher_id: string };
}

const PublisherView = async ({ params }: Props) => {
  const { publisher_id } = await params;
  const idAsNumber = +publisher_id; 
  if(isNaN(idAsNumber) || !idAsNumber){
    console.error(`Invalid publisher_id provided: ${publisher_id}`);
  }

  const isStaff = await isUserStaff();
  
  const publisher = await getPublisherData(idAsNumber);
  const dueDate = publisher.dueDate ? new Date(publisher.dueDate) : null;
  const pastDue = dueDate ? (new Date() > dueDate) : false;
  const dueDateReadable = dueDate ? dueDate.toLocaleString() : "Brak";

  const adminArticles = isStaff ? await getAdminPublisherArticles(idAsNumber) : null;
  const regularUserArticles = !isStaff ? await getUserPublisherArticles(idAsNumber) : null;

  return (
    <>
      <div>
        <h1 style={{marginBottom: "8px"}}>Wydawnictwo "{publisher.name}"</h1>
        <p style={{marginBottom: "32px"}}>{publisher.description}</p>
        <p>Termin przesłania: {dueDateReadable} </p>
        {!pastDue && !isStaff &&
          <Button style={{gap: "8px"}} variant='contained' href={`/myspace/publishers/${publisher.id}/new-article`} component={Link}>
            Przeslij raport
            <FontAwesomeIcon icon={faPlus}/>
          </Button>
        }
        {isStaff && <AdminActions publisher={publisher}/>}
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