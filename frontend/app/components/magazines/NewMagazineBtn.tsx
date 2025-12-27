'use client'

import React, { useState } from 'react'
import { Button } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

import styles from './Btn.module.css'
import NewMagazineModal from './NewMagazineModal'
import { Magazine } from '@/app/types/types'



const NewMagazineBtn = ({ setMagazinesState }: { setMagazinesState: React.Dispatch<React.SetStateAction<Magazine[]>> }) => {
    const [showModal, setShowModal] = useState(false);

    function handleClick() {
        setShowModal(!showModal);
    }

    return (
        <>
            <Button className={styles.joinBtn} variant='contained' onClick={handleClick} startIcon={<FontAwesomeIcon icon={faPlus} />}>Nowe czasopismo</Button>
            {showModal && (
                <NewMagazineModal setShowModal={setShowModal} setMagazinesState={setMagazinesState} />
            )}

        </>
    )
}

export default NewMagazineBtn