"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/pl';
import { plPL } from '@mui/x-date-pickers/locales';
import styles from "../Modal.module.css";
import { updateMagazine } from "@/app/utils/magazine-helper";
import { Magazine } from "@/app/types/types";
import { useUI } from "@/app/context/UIContext";

const DueDateTab = ({
    magazine,
    onDueDateUpdate
}: {
    magazine: Magazine,
    onDueDateUpdate: (newDueDate: string) => void;
}) => {
    const [date, setDate] = useState<Dayjs | null>(dayjs().add(1, 'day').startOf('hour'));
    const { showSnackbar } = useUI();

    useEffect(() => {
        if (magazine.dueDate && magazine.dueDate !== "") {
            const parsedDate = dayjs(magazine.dueDate);
            if (parsedDate.isValid()) {
                setDate(parsedDate);
            }
        }
    }, [magazine.dueDate]);

    async function handleSubmit() {
        if (date === null) {
            return;
        }
        const dueDate = date.toISOString();
        try {
            await updateMagazine({ id: magazine.id, dueDate });
            onDueDateUpdate(dueDate);
            showSnackbar("Termin oddania zaktualizowany", "success");
        }
        catch (error) {
            console.error("Error updating magazine due date:", error);
        }
    }

    return (
        <div style={{ padding: '20px 0' }}>
            <div className={styles.input}>
                <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale="pl"
                    localeText={plPL.components.MuiLocalizationProvider.defaultProps.localeText}
                >
                    <DateTimePicker
                        className={styles.datetimeInput}
                        format="DD.MM.YYYY HH:mm"
                        value={date}
                        onChange={(newValue) => { setDate(newValue) }}
                        slotProps={{ textField: { fullWidth: true } }}
                        label="Termin oddania"
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
