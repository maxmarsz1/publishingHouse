"use client";

import React, { useState } from "react";
import Backdrop from "../general/Backdrop";
import { Button, TextField } from "@mui/material";

import styles from "./Modal.module.css";
import { createMagazine } from "@/app/utils/magazine-helper";
import { Magazine } from "@/app/types/types";

const NewMagazineModal = ({
  setShowModal,
  setMagazinesState,
}: {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setMagazinesState: React.Dispatch<React.SetStateAction<Magazine[]>>;
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  function cancel() {
    setShowModal(false);
  }

  async function handleSubmit() {
    if (!name.trim()) {
      setError("Nazwa jest wymagana");
      return;
    }

    setError(null);

    try {
      const response = await createMagazine({ name, description });
      console.log(response);
      setMagazinesState((prevMagazines: Magazine[]) => [
        response,
        ...prevMagazines,
      ]);
      setShowModal(false);
    } catch (error) {
      if (error instanceof Error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const axiosError = error as any;
        if (axiosError.response?.data?.name) {
          console.error(
            "Error creating magazine:",
            axiosError.response.data.name
          );
          setError("Czasopismo z tą nazwą już istnieje");
        } else {
          console.error("Error creating magazine:", error.message);
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
        <h2>Stwórz nowe czasopismo</h2>
        {error && <p className={styles.error}>{error}</p>}
        <TextField
          variant="standard"
          label="Nazwa"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", marginBottom: '16px' }}
        />
        <TextField
          multiline
          maxRows={4}
          variant="standard"
          label="Opis"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: "100%", marginBottom: '32px' }}
        />
        <div className={styles.buttons}>
          <Button variant="outlined" onClick={cancel}>
            Anuluj
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            Stwórz
          </Button>
        </div>
      </div>
    </>
  );
};

export default NewMagazineModal;
