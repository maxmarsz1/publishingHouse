'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette:{
    primary:{
      main: "#EB5E28"
    }
  },
  typography: {
    fontFamily: 'var(--font-roboto)',
  },
  cssVariables: true,
});

export default theme;
