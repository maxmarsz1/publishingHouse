import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { Button } from '@mui/material'
import Link from 'next/link'

import RaportsTable from '@/app/components/raports/RaportsTable'
import { getUserRaports, getRaportsToReview } from '@/app/utils/raports-helper'
import { getPublisherData } from '@/app/utils/publisher-helper'


interface Props {
  params: { id: string };
}

const PublisherView = async ({ params }: Props) => {
  const { id } = params;
  console.log("Publisher ID:", id);
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

      <RaportsTable title={"Twoje raporty"} raports={getUserRaports(publisher)}></RaportsTable>
      <RaportsTable title={"Raporty do recenzji"} raports={getRaportsToReview(publisher)}></RaportsTable>
    </div>
  )
}

export default PublisherView