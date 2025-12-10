"use client";

import React, { useState } from "react";
import { Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import ManagementModal from "./ManagementModal";
import { Publisher, User } from "@/app/types/types";

const ManageBtn = ({
    publisher,
    onDueDateUpdate,
    members,
    setMembers,
}: {
    publisher: Publisher;
    onDueDateUpdate: (newDueDate: string) => void;
    members: User[] | null;
    setMembers: React.Dispatch<React.SetStateAction<User[] | null>>;
}) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <Button
                variant="contained"
                onClick={handleOpen}
                startIcon={<FontAwesomeIcon icon={faGear} style={{ fontSize: '14px' }} />}
            >
                Zarządzaj
            </Button>
            {open && (
                <ManagementModal
                    open={open}
                    onClose={handleClose}
                    publisher={publisher}
                    onDueDateUpdate={onDueDateUpdate}
                    members={members}
                    setMembers={setMembers}
                />
            )}
        </>
    );
};

export default ManageBtn;
