import React, { useState } from "react";

import styles from "./Modal.module.css";
import Backdrop from "../general/Backdrop";
import { Button, TextField } from "@mui/material";
import { Magazine } from "@/app/types/types";
import { joinMagazine } from "@/app/utils/magazine-helper";

const JoinMagazineModal = ({
  setShowModal,
  setMagazinesState,
}: {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setMagazinesState: React.Dispatch<React.SetStateAction<Magazine[]>>;
}) => {
  const [joinCode, setJoinCode] = useState("");
  function cancel() {
    setShowModal(false);
  }

  async function handleSubmit() {
    if (!joinCode.trim()) {
      return;
    }
    try {
      const joinedMagazine = await joinMagazine(joinCode);
      console.log("Joined magazine: ", joinedMagazine.name);
      setMagazinesState((prevMagazines => [...prevMagazines, joinedMagazine]));
      setShowModal(false);
    }
    catch (error) {
      console.error("Error joining magazine:", error);
    }
  }

  return (
    <>
      <Backdrop />
      <div className={styles.modal}>
        <h2>Dołącz do czasopisma</h2>
        <div className={styles.input}>
          <span>Kod: </span>
          <TextField variant="standard" value={joinCode} onChange={(e) => setJoinCode(e.target.value)} style={{ width: "100%" }} />
        </div>
        <div className={styles.buttons}>
          <Button variant="outlined" onClick={cancel}>
            Anuluj
          </Button>
          <Button variant="contained" onClick={handleSubmit}>Dołącz</Button>
        </div>
      </div>
    </>
  );
};

export default JoinMagazineModal;
