"use client";

import React, { useState } from "react";
import { Button } from "@mui/material";
import NewDueDateModal from "./NewDueDateModal";
import { Publisher } from "@/app/types/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";

const NewDueDateBtn = ({
  publisher,
  onDueDateUpdate,
}: {
  publisher: Publisher;
  onDueDateUpdate: (newDueDate: string) => void;
}) => {
  const [showModal, setShowModal] = useState(false);

  function handleClick() {
    setShowModal(!showModal);
  }
  return (
    <>
      <Button variant="contained" color="success" onClick={handleClick}>
        Nowy termin&nbsp;
        <FontAwesomeIcon icon={faCalendar}/>
      </Button>

      {showModal && (
        <NewDueDateModal setShowModal={setShowModal} publisher={publisher} onDueDateUpdate={onDueDateUpdate} />
      )}
    </>
  );
};

export default NewDueDateBtn;
