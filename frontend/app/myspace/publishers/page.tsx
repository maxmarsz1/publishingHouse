import React from 'react'
import PublishersContainer from "../../components/publisher/PublishersContainer"
import { Publisher } from '@/app/types/types'
import { getPublishers } from '@/app/utils/publisher-helper'


const Publishers = async () => {
  const publishers = await getPublishers();

  return (
    <>
      <PublishersContainer publishers={publishers} />
    </>
  )
}

export default Publishers