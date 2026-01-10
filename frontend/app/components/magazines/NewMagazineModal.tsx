import React, { useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

import styles from "./Modal.module.css";
import { createMagazine } from "@/app/utils/magazine-helper";
import { Magazine } from "@/app/types/types";

const NewMagazineModal = ({
  open,
  handleClose,
  setMagazinesState,
}: {
  open: boolean;
  handleClose: () => void;
  setMagazinesState: React.Dispatch<React.SetStateAction<Magazine[]>>;
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  function resetForm() {
    setName("");
    setDescription("");
    setError(null);
  }

  function handleCancel() {
    resetForm();
    handleClose();
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
      resetForm();
      handleClose();
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
    <Dialog
      open={open}
      onClose={handleCancel}
      PaperProps={{
        sx: {
          backgroundColor: "var(--background)",
          backgroundImage: "none", // To remove default MUI gradient in dark mode if needed
        },
      }}
    >
      <DialogTitle sx={{ color: "var(--text)" }}>Stwórz nowe czasopismo</DialogTitle>
      <DialogContent>
        {error && <p className={styles.error}>{error}</p>}
        <TextField
          autoFocus
          margin="dense"
          variant="standard"
          label="Nazwa"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          style={{ marginBottom: "16px" }}
        />
        <TextField
          multiline
          maxRows={4}
          margin="dense"
          variant="standard"
          label="Opis"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          style={{ marginBottom: "32px" }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Anuluj</Button>
        <Button onClick={handleSubmit} variant="contained">
          Stwórz
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewMagazineModal;
