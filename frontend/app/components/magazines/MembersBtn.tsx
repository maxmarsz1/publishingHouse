'use client'

import { Button } from '@mui/material'
import React, { useState } from 'react'
import MembersModal from './MembersModal';
import { Publisher, User } from '@/app/types/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import { getPublisherMembers } from '@/app/utils/publisher-helper';

const MembersBtn = ({
  publisher,
  members,
  setMembers
}: {
  publisher: Publisher;
  members: User[] | null;
  setMembers: React.Dispatch<React.SetStateAction<User[] | null>>;
}) => {
  const [showModal, setShowModal] = useState(false);

  async function handleOpen() {
    setShowModal(true);
    if (members === null && publisher.id) {
      try {
        const fetchedMembers = await getPublisherMembers(publisher.id);
        setMembers(fetchedMembers);
      } catch (error) {
        console.error("Error fetching members:", error);
        // Optionally handle error state here or in modal
      }
    }
  }

  return (
    <>
      <Button variant='contained' onClick={handleOpen}>
        Zarządzaj członkami&nbsp;
        <FontAwesomeIcon icon={faUser} />
      </Button>

      {showModal &&
        <MembersModal
          publisher={publisher}
          setShowModal={setShowModal}
          members={members}
          setMembers={setMembers}
        />
      }
    </>
  )
}

export default MembersBtn