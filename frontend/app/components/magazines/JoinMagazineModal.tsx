import React, { useState } from "react";

import styles from "./Modal.module.css";
import Backdrop from "../general/Backdrop";
import { Button, TextField } from "@mui/material";
import { Publisher } from "@/app/types/types";
import { joinPublisher } from "@/app/utils/publisher-helper";

const JoinMagazineModal = ({
  setShowModal,
  setPublishersState,
}: {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setPublishersState: React.Dispatch<React.SetStateAction<Publisher[]>>;
}) => {
  const [joinCode, setJoinCode] = useState("");
  function cancel() {
    setShowModal(false);
  }

  async function handleSubmit(){
    if(!joinCode.trim()){
      return;
    }
    try {
      const joinedPublisher = await joinPublisher(joinCode);
      console.log("Joined publisher: ", joinedPublisher.name);
      setPublishersState((prevPublishers => [...prevPublishers, joinedPublisher]));
      setShowModal(false);
    }
    catch(error){
      console.error("Error joining publisher:", error);
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
