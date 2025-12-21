'use client';

import React, { useEffect, useState, useContext } from 'react';
import { Button, Container, TextField, Typography, Paper, Grid } from '@mui/material';
import apiClient from '@/app/utils/api-client';
import { UserContext } from '@/app/context/UserContext';
import { useUI } from '@/app/context/UIContext';
import { useRouter } from 'next/navigation';

interface AppSettings {
    abstract_min_words: number;
    abstract_max_words: number;
    review_min_words: number;
    review_max_words: number;
}

const numberInputSx = {
    '& input[type=number]': {
        '-moz-appearance': 'textfield',
    },
    '& input[type=number]::-webkit-outer-spin-button': {
        '-webkit-appearance': 'none',
        margin: 0,
    },
    '& input[type=number]::-webkit-inner-spin-button': {
        '-webkit-appearance': 'none',
        margin: 0,
    },
};

const SettingsPage = () => {
    const { isStaff } = useContext(UserContext);
    const { showSnackbar } = useUI();
    const router = useRouter();
    const [settings, setSettings] = useState<AppSettings>({
        abstract_min_words: 150,
        abstract_max_words: 250,
        review_min_words: 50,
        review_max_words: 500,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isStaff) {
            return;
        }

        const fetchSettings = async () => {
            try {
                const res = await apiClient.get('/settings/');
                setSettings(res.data);
            } catch (error) {
                console.error("Failed to load settings", error);
                showSnackbar("Nie udało się pobrać ustawień.", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, [isStaff, showSnackbar]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSettings({
            ...settings,
            [e.target.name]: parseInt(e.target.value) || 0,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiClient.post('/settings/', settings);
            showSnackbar("Ustawienia zostały zapisane.", "success");
        } catch (error) {
            console.error("Failed to save settings", error);
            showSnackbar("Wystąpił błąd podczas zapisywania ustawień.", "error");
        }
    };

    if (!isStaff) return <p>Brak dostępu.</p>;
    if (loading) return <p>Ładowanie...</p>;

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper sx={{ p: 4, backgroundColor: 'var(--background)', color: 'var(--text)' }}>
                <Typography variant="h4" gutterBottom>
                    Ustawienia Aplikacji
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12 }}>
                            <Typography variant="h6">Limity słów abstraktu</Typography>
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <TextField
                                fullWidth
                                label="Minimalna liczba słów"
                                name="abstract_min_words"
                                type="number"
                                value={settings.abstract_min_words}
                                onChange={handleChange}
                                sx={numberInputSx}
                            />
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <TextField
                                fullWidth
                                label="Maksymalna liczba słów"
                                name="abstract_max_words"
                                type="number"
                                value={settings.abstract_max_words}
                                onChange={handleChange}
                                sx={numberInputSx}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Typography variant="h6">Limity słów komentarza recenzji</Typography>
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <TextField
                                fullWidth
                                label="Minimalna liczba słów"
                                name="review_min_words"
                                type="number"
                                value={settings.review_min_words}
                                onChange={handleChange}
                                sx={numberInputSx}
                            />
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <TextField
                                fullWidth
                                label="Maksymalna liczba słów"
                                name="review_max_words"
                                type="number"
                                value={settings.review_max_words}
                                onChange={handleChange}
                                sx={numberInputSx}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Button variant="contained" color="primary" type="submit">
                                Zapisz ustawienia
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
};

export default SettingsPage;
