import React from 'react'

import RaportsTable from '@/app/components/raports/RaportsTable'
import { getUserRaports, getRaportsToReview } from '@/app/utils/raports-helper'

const Articles = () => {
  return (
    <div>
      <div>
        <h1 style={{marginBottom: "8px"}}>Twoje raporty</h1>
      </div>

      <RaportsTable title={"Wysłane raporty"} showPublisher={true} raports={getUserRaports()}></RaportsTable>
      <RaportsTable title={"Raporty do recenzji"} showPublisher={true} raports={getRaportsToReview()}></RaportsTable>
    </div>
  )
}

export default Articles