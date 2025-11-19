import React from 'react'
import MagazineContainer from "../../components/magazines/MagazineContainer"
import { getPublishers } from '@/app/utils/publisher-helper'
import { isUserStaff } from '@/app/utils/auth-server-helper'


const Publishers = async () => {
  const publishers = await getPublishers();
  const isStaff = await isUserStaff();

  return (
    <>
      <MagazineContainer publishers={publishers} isStaff={isStaff}/>
    </>
  )
}

export default Publishers