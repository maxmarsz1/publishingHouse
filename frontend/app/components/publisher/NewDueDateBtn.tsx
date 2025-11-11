"use client";

import React, { useState } from "react";
import { Button } from "@mui/material";
import NewDueDateModal from "./NewDueDateModal";
import { Publisher } from "@/app/types/types";

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
      <Button variant="contained" onClick={handleClick}>
        Nowy termin
      </Button>

      {showModal && (
        <NewDueDateModal setShowModal={setShowModal} publisher={publisher} onDueDateUpdate={onDueDateUpdate} />
      )}
    </>
  );
};

export default NewDueDateBtn;
