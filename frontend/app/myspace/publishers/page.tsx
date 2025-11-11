import React from 'react'
import PublishersContainer from "../../components/publisher/PublishersContainer"
import { getPublishers } from '@/app/utils/publisher-helper'
import { isUserStaff } from '@/app/utils/auth-server-helper'


const Publishers = async () => {
  const publishers = await getPublishers();
  const isStaff = await isUserStaff();

  return (
    <>
      <PublishersContainer publishers={publishers} isStaff={isStaff}/>
    </>
  )
}

export default Publishers