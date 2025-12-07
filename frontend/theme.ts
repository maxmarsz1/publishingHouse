'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: "#EB5E28"
    }
  },
  typography: {
    fontFamily: 'var(--font-poppins)',
  },
  cssVariables: true,
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'white',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'white',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'white',
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          color: 'white',
          '&::placeholder': {
            color: 'rgba(255, 255, 255, 0.7)',
            opacity: 1,
          },
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        asterisk: {
          color: 'red',
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        asterisk: {
          color: 'red',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: 'white',
          '&.MuiInputLabel-shrink': {
            color: 'white',
          },
          '&.Mui-focused': {
            color: 'white',
          },
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          '&:before': {
            borderBottomColor: 'white',
          },
          '&:hover:not(.Mui-disabled):before': {
            borderBottomColor: 'white',
          },
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          '&:before': {
            borderBottomColor: 'white',
          },
          '&:hover:not(.Mui-disabled):before': {
            borderBottomColor: 'white',
          },
        },
      },
    },
  }
});

export default theme;
