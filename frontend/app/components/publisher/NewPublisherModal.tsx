"use client";

import React, { useState } from "react";
import Backdrop from "../general/Backdrop";
import { Button, TextField } from "@mui/material";

import styles from "./Modal.module.css";
import { createPublisher } from "@/app/utils/publisher-helper-client";
import { Publisher } from "@/app/types/types";

const NewPublisherModal = ({
  setShowModal,
  setPublishersState
}: {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
  setPublishersState: React.Dispatch<React.SetStateAction<Publisher[]>>
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  function cancel() {
    setShowModal(false);
  }

  async function handleSubmit(){
    if (!name.trim()) {
      setError("Nazwa jest wymagana");
      return;
    }

    setError(null);

    try {
      const response = await createPublisher({ name, description });
      console.log(response);
      setPublishersState((prevPublishers: Publisher[]) => [...prevPublishers, response]);
      setShowModal(false);
    } catch (error) {
      if (error instanceof Error) {
        const axiosError = error as any;
        if (axiosError.response?.data?.name) {
          console.error("Error creating publisher:", axiosError.response.data.name);
          setError("Wydawnictwo z tą nazwą już istnieje");
        } else {
          console.error("Error creating publisher:", error.message);
        }
      } else {
        console.error("An unknown error occurred:", error);
      }
    }
  }

  return (
    <>
      <Backdrop />
      <div className={styles.modal}>
        <h2>Stwórz nowe wydawnictwo</h2>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.input}>
          <span>Nazwa: </span>
          <TextField variant="standard" value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%" }} />
        </div>
        <div className={styles.input}>
          <span>Opis: </span>
          <TextField variant="standard" value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: "100%" }} />
        </div>
        <div className={styles.buttons}>
          <Button variant="outlined" onClick={cancel}>
            Anuluj
          </Button>
          <Button variant="contained" onClick={handleSubmit}>Stwórz</Button>
        </div>
      </div>
    </>
  );
};

export default NewPublisherModal;
