"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from 'dayjs';
import styles from "../Modal.module.css";
import { updatePublisher } from "@/app/utils/publisher-helper";
import { Publisher } from "@/app/types/types";
import { useUI } from "@/app/context/UIContext";

const DueDateTab = ({
    publisher,
    onDueDateUpdate
}: {
    publisher: Publisher,
    onDueDateUpdate: (newDueDate: string) => void;
}) => {
    const [date, setDate] = useState<Dayjs | null>(dayjs().add(1, 'day').startOf('hour'));
    const { showSnackbar } = useUI();

    useEffect(() => {
        if (publisher.dueDate && publisher.dueDate !== "") {
            const parsedDate = dayjs(publisher.dueDate);
            if (parsedDate.isValid()) {
                setDate(parsedDate);
            }
        }
    }, [publisher.dueDate]);

    async function handleSubmit() {
        if (date === null) {
            return;
        }
        const dueDate = date.toISOString();
        try {
            await updatePublisher({ id: publisher.id, dueDate });
            onDueDateUpdate(dueDate);
            showSnackbar("Termin oddania zaktualizowany", "success");
        }
        catch (error) {
            console.error("Error updating publisher due date:", error);
        }
    }

    return (
        <div style={{ padding: '20px 0' }}>
            <div className={styles.input}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                        className={styles.datetimeInput}
                        format="DD/MM/YYYY HH:mm"
                        value={date}
                        onChange={(newValue) => { setDate(newValue) }}
                        slotProps={{ textField: { fullWidth: true } }}
                    />
                </LocalizationProvider>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" color="success" onClick={handleSubmit}>Zapisz</Button>
            </div>
        </div>
    );
};

export default DueDateTab;
