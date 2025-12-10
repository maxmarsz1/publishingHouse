'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Button, DialogContentText } from '@mui/material';

interface SnackbarState {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
}

interface ConfirmDialogState {
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
}

interface UIContextType {
    showSnackbar: (message: string, severity?: 'success' | 'error' | 'warning' | 'info') => void;
    showConfirm: (title: string, message: string, onConfirm: () => void) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [snackbar, setSnackbar] = useState<SnackbarState>({ open: false, message: '', severity: 'info' });
    const [confirm, setConfirm] = useState<ConfirmDialogState>({ open: false, title: '', message: '', onConfirm: () => { } });

    const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning' | 'info' = 'info') => {
        setSnackbar({ open: true, message, severity });
    };

    const showConfirm = (title: string, message: string, onConfirm: () => void) => {
        setConfirm({ open: true, title, message, onConfirm });
    };

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleConfirmClose = () => {
        setConfirm({ ...confirm, open: false });
    };

    const handleConfirmAction = () => {
        confirm.onConfirm();
        handleConfirmClose();
    };

    return (
        <UIContext.Provider value={{ showSnackbar, showConfirm }}>
            {children}
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
            <Dialog
                open={confirm.open}
                onClose={handleConfirmClose}
                PaperProps={{
                    sx: {
                        backgroundColor: 'var(--background)',
                        backgroundImage: 'none',
                        color: 'var(--text)'
                    }
                }}
            >
                <DialogTitle>{confirm.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: 'var(--text-secondary)' }}>
                        {confirm.message}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmClose} color="secondary">Anuluj</Button>
                    <Button onClick={handleConfirmAction} color="primary" autoFocus>Potwierdź</Button>
                </DialogActions>
            </Dialog>
        </UIContext.Provider>
    );
};

export const useUI = () => {
    const context = useContext(UIContext);
    if (!context) {
        throw new Error('useUI must be used within a UIProvider');
    }
    return context;
};
