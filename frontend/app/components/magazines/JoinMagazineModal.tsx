import React, { useState } from "react";

import styles from "./Modal.module.css";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Magazine } from "@/app/types/types";
import { joinMagazine } from "@/app/utils/magazine-helper";

const JoinMagazineModal = ({
  open,
  handleClose,
  setMagazinesState,
}: {
  open: boolean;
  handleClose: () => void;
  setMagazinesState: React.Dispatch<React.SetStateAction<Magazine[]>>;
}) => {
  const [joinCode, setJoinCode] = useState("");

  function resetForm() {
    setJoinCode("");
  }

  function handleCancel() {
    resetForm();
    handleClose();
  }

  async function handleSubmit() {
    if (!joinCode.trim()) {
      return;
    }
    try {
      const joinedMagazine = await joinMagazine(joinCode);
      console.log("Joined magazine: ", joinedMagazine.name);
      setMagazinesState((prevMagazines) => [...prevMagazines, joinedMagazine]);
      resetForm();
      handleClose();
    } catch (error) {
      console.error("Error joining magazine:", error);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      PaperProps={{
        sx: {
          backgroundColor: "var(--background)",
          backgroundImage: "none",
        },
      }}
    >
      <DialogTitle sx={{ color: "var(--text)" }}>Dołącz do czasopisma</DialogTitle>
      <DialogContent>
        <div className={styles.input}>
          <TextField
            autoFocus
            margin="dense"
            variant="standard"
            label="Kod dołączenia"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            fullWidth
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Anuluj</Button>
        <Button onClick={handleSubmit} variant="contained">
          Dołącz
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default JoinMagazineModal;
