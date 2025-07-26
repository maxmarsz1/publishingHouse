import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { Publisher } from '@/app/types/types'
import RaportsTable from '@/app/components/publisher/RaportsTable'
import { Raport, Status } from '@/app/types/types'
import { Button } from '@mui/material';
import Link from 'next/link'


interface Props {
  params: { id: string };
}

function getPublisherData(id: number): Publisher{
  // mocking data fetching from backend
  return {
    id: id,
    name: "Dump publisher",
    description: "Lorem ipsum longer description of publisher here continue with the lorem ipsum text and then again with more text"
  }
}

function getRaportsToReview(): Raport[]{
  const raports: Raport[] = [
    {
      id: 1,
      title: "Raport 1",
      status: Status.Pending,
      grade: 0
    },
    {
      id: 2,
      title: "Raport 2",
      status: Status.Published,
      grade: 5
    },
    {
      id: 3,
      title: "Raport 3",
      status: Status.Rejected,
      grade: 0
    }
  ]
  return raports;
}

function getUserRaports(): Raport[]{
  const raports: Raport[] = [
    {
      id: 1,
      title: "Raport 1",
      status: Status.Pending,
      grade: 0
    },
    {
      id: 2,
      title: "Raport 2",
      status: Status.Published,
      grade: 5
    },
    {
      id: 3,
      title: "Raport 3",
      status: Status.Rejected,
      grade: 0
    }
  ]
  return raports;
}

const PublisherView = async ({ params }: Props) => {
  const { id } = await params;

  const publisher = getPublisherData(+id);

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

      <RaportsTable title={"Twoje raporty"} raports={getUserRaports()}></RaportsTable>
      <RaportsTable title={"Raporty do recenzji"} raports={getRaportsToReview()}></RaportsTable>
    </div>
  )
}

export default PublisherView