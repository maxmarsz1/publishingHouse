'use client'

import { Button } from '@mui/material'
import React, { useState } from 'react'
import MembersModal from './MembersModal';
import { Publisher } from '@/app/types/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const MembersBtn = ({publisher}: {publisher: Publisher}) => {
    const [showModal, setShowModal] = useState(false);

  return (
    <>
    <Button variant='contained' onClick={() => setShowModal(true)}>
      Zarządzaj członkami&nbsp;
      <FontAwesomeIcon icon={faUser}/>
    </Button>

    {showModal &&
        <MembersModal publisher={publisher} setShowModal={setShowModal}/>
    }
    </>
  )
}

export default MembersBtn