"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle, Tab, Tabs, Box, IconButton } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { Magazine, User } from "@/app/types/types";
import DueDateTab from "./tabs/DueDateTab";
import MembersTab from "./tabs/MembersTab";
import SettingsTab from "./tabs/SettingsTab";
import InfoTab from "./tabs/InfoTab";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 2 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const ManagementModal = ({
    open,
    onClose,
    magazine,
    onUpdateMagazine,
    onDueDateUpdate,
    members,
    setMembers,
}: {
    open: boolean;
    onClose: () => void;
    magazine: Magazine;
    onUpdateMagazine: (updatedMagazine: Magazine) => void;
    onDueDateUpdate: (newDueDate: string) => void;
    members: User[] | null;
    setMembers: React.Dispatch<React.SetStateAction<User[] | null>>;
}) => {
    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            PaperProps={{
                sx: {
                    backgroundColor: 'var(--background)',
                    backgroundImage: 'none', // Reset MUI elevation gradient
                    color: 'var(--text)'
                }
            }}
        >
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Zarządzanie czasopismem
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <FontAwesomeIcon icon={faClose} />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ borderBottom: 1, borderColor: 'var(--primary)' }}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        aria-label="management tabs"
                        variant="scrollable"
                        scrollButtons="auto"
                    >
                        <Tab label="Dane" sx={{ color: 'var(--text)' }} />
                        <Tab label="Termin oddania" sx={{ color: 'var(--text)' }} />
                        <Tab label="Członkowie" sx={{ color: 'var(--text)' }} />
                        <Tab label="Ustawienia" sx={{ color: 'var(--text)' }} />
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                    <InfoTab magazine={magazine} onUpdateMagazine={onUpdateMagazine} />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    <DueDateTab magazine={magazine} onDueDateUpdate={onDueDateUpdate} />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={2}>
                    <MembersTab magazine={magazine} members={members} setMembers={setMembers} />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={3}>
                    {magazine.id && <SettingsTab magazineId={magazine.id} />}
                </CustomTabPanel>
            </DialogContent>
        </Dialog>
    );
};

export default ManagementModal;
