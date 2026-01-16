'use client';

import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import { Magazine } from '@/app/types/types';
import { updateMagazine } from '@/app/utils/magazine-helper';
import { useUI } from '@/app/context/UIContext';

const InfoTab = ({
    magazine,
    onUpdateMagazine
}: {
    magazine: Magazine;
    onUpdateMagazine: (updatedMagazine: Magazine) => void;
}) => {
    const [name, setName] = useState(magazine.name);
    const [description, setDescription] = useState(magazine.description || '');
    const { showSnackbar } = useUI();

    const handleSave = async () => {
        try {
            const updated = await updateMagazine({ id: magazine.id, name, description });
            onUpdateMagazine(updated);
            showSnackbar("Zaktualizowano dane czasopisma", "success");
        } catch (error) {
            console.error(error);
            showSnackbar("Wystąpił błąd podczas aktualizacji", "error");
        }
    };

    return (
        <div style={{ padding: '20px 0', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <TextField
                label="Nazwa czasopisma"
                variant="outlined"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <TextField
                label="Opis"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <Button
                variant="contained"
                onClick={handleSave}
                sx={{ alignSelf: 'flex-start' }}
            >
                Zapisz zmiany
            </Button>
        </div>
    );
};

export default InfoTab;
