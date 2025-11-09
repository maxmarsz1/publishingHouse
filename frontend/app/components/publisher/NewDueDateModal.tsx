"use client";

import React, { useState, useEffect } from "react";
import Backdrop from "../general/Backdrop";
import { Button } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from 'dayjs';

import styles from "./Modal.module.css";
import { updatePublisher } from "@/app/utils/publisher-helper-client";
import { Publisher } from "@/app/types/types";

const NewDueDateModal = ({
  setShowModal,
  publisher
}: {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
  publisher: Publisher
}) => {
  const [date, setDate] = useState<Dayjs | null>(dayjs());
  useEffect(() => {
    if (publisher.dueDate && publisher.dueDate !== "") {
      const parsedDate = dayjs(publisher.dueDate);
      if (parsedDate.isValid()) {
        setDate(parsedDate);
      }
    }
  }, [publisher.dueDate]);
  
  function cancel() {
    setShowModal(false);
  }

  async function handleSubmit(){
    if(date === null){
      return;
    }
    const dueDate = date.toISOString();
    try{
      updatePublisher({...publisher, dueDate});
      setShowModal(false);
    }
    catch(error){
      console.error("Error updating publisher due date:", error);
    }
  }


  return (
    <>
      <Backdrop />
      <div className={styles.modal}>
        <h2>Zmień termin oddania</h2>
        <div className={styles.input}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              className={styles.datetimeInput}
              format="DD/MM/YYYY HH:mm"
              value={date}
              onChange={(newValue) => {setDate(newValue)}}
            />
          </LocalizationProvider>
        </div>
        <div className={styles.buttons}>
          <Button variant="outlined" onClick={cancel}>
            Anuluj
          </Button>
          <Button variant="contained" onClick={handleSubmit}>Zmień</Button>
        </div>
      </div>
    </>
  );
};

export default NewDueDateModal;
