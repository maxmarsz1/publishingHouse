'use client'

import { Button } from '@mui/material'
import React, { useState } from 'react'
import MembersModal from './MembersModal';
import { Publisher } from '@/app/types/types';

const MembersBtn = ({publisher}: {publisher: Publisher}) => {
    const [showModal, setShowModal] = useState(false);

  return (
    <>
    <Button variant='outlined' onClick={() => setShowModal(true)}>Zarządzaj członkami</Button>

    {showModal &&
        <MembersModal publisher={publisher} setShowModal={setShowModal}/>
    }
    </>
  )
}

export default MembersBtn