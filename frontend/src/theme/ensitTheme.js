import { createTheme } from '@mui/material/styles';

// Couleurs extraites des logos ENSIT
const ensitTheme = createTheme({
  palette: {
    primary: {
      main: '#E32726', // Rouge ENSIT
      light: '#ff5f52',
      dark: '#a90000',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#3A5CAA', // Bleu ENSIT
      light: '#6e87dc',
      dark: '#00347a',
      contrastText: '#ffffff',
    },
    accent1: {
      main: '#F8CC29', // Jaune ENSIT
      light: '#ffff61',
      dark: '#c19c00',
    },
    accent2: {
      main: '#8CB23E', // Vert ENSIT
      light: '#bde56c',
      dark: '#5c8200',
    },
    accent3: {
      main: '#E08E3C', // Orange ENSIT
      light: '#ffbe6a',
      dark: '#aa6000',
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff',
      dark: '#2c3e50',
    },
    text: {
      primary: '#2c3e50',
      secondary: '#546e7a',
      disabled: '#b0bec5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.01562em',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.3,
      letterSpacing: '-0.00833em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.3,
      letterSpacing: '0em',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.35,
      letterSpacing: '0.00735em',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.25rem',
      lineHeight: 1.4,
      letterSpacing: '0em',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.5,
      letterSpacing: '0.0075em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0px 2px 1px -1px rgba(0,0,0,0.05),0px 1px 1px 0px rgba(0,0,0,0.03),0px 1px 3px 0px rgba(0,0,0,0.05)',
    '0px 3px 3px -2px rgba(0,0,0,0.06),0px 3px 4px 0px rgba(0,0,0,0.04),0px 1px 8px 0px rgba(0,0,0,0.06)',
    '0px 3px 5px -1px rgba(0,0,0,0.06),0px 6px 10px 0px rgba(0,0,0,0.04),0px 1px 18px 0px rgba(0,0,0,0.06)',
    '0px 5px 5px -3px rgba(0,0,0,0.07),0px 8px 10px 1px rgba(0,0,0,0.05),0px 3px 14px 2px rgba(0,0,0,0.07)',
    '0px 6px 7px -4px rgba(0,0,0,0.07),0px 11px 15px 1px rgba(0,0,0,0.05),0px 4px 20px 3px rgba(0,0,0,0.07)',
    '0px 7px 8px -4px rgba(0,0,0,0.07),0px 12px 17px 2px rgba(0,0,0,0.05),0px 5px 22px 4px rgba(0,0,0,0.07)',
    '0px 7px 8px -4px rgba(0,0,0,0.07),0px 13px 19px 2px rgba(0,0,0,0.05),0px 5px 24px 4px rgba(0,0,0,0.07)',
    '0px 7px 9px -4px rgba(0,0,0,0.07),0px 14px 21px 2px rgba(0,0,0,0.05),0px 5px 26px 4px rgba(0,0,0,0.07)',
    '0px 8px 9px -5px rgba(0,0,0,0.07),0px 15px 22px 2px rgba(0,0,0,0.05),0px 6px 28px 5px rgba(0,0,0,0.07)',
    '0px 8px 10px -5px rgba(0,0,0,0.07),0px 16px 24px 2px rgba(0,0,0,0.05),0px 6px 30px 5px rgba(0,0,0,0.07)',
    '0px 8px 11px -5px rgba(0,0,0,0.07),0px 17px 26px 2px rgba(0,0,0,0.05),0px 6px 32px 5px rgba(0,0,0,0.07)',
    '0px 9px 11px -5px rgba(0,0,0,0.07),0px 18px 28px 2px rgba(0,0,0,0.05),0px 7px 34px 6px rgba(0,0,0,0.07)',
    '0px 9px 12px -6px rgba(0,0,0,0.07),0px 19px 29px 2px rgba(0,0,0,0.05),0px 7px 36px 6px rgba(0,0,0,0.07)',
    '0px 10px 13px -6px rgba(0,0,0,0.07),0px 20px 31px 3px rgba(0,0,0,0.05),0px 8px 38px 7px rgba(0,0,0,0.07)',
    '0px 10px 13px -6px rgba(0,0,0,0.07),0px 21px 33px 3px rgba(0,0,0,0.05),0px 8px 40px 7px rgba(0,0,0,0.07)',
    '0px 10px 14px -6px rgba(0,0,0,0.07),0px 22px 35px 3px rgba(0,0,0,0.05),0px 8px 42px 7px rgba(0,0,0,0.07)',
    '0px 11px 14px -7px rgba(0,0,0,0.07),0px 23px 36px 3px rgba(0,0,0,0.05),0px 9px 44px 8px rgba(0,0,0,0.07)',
    '0px 11px 15px -7px rgba(0,0,0,0.07),0px 24px 38px 3px rgba(0,0,0,0.05),0px 9px 46px 8px rgba(0,0,0,0.07)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          boxShadow: 'none',
          padding: '8px 16px',
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #E32726 30%, #ff5f52 90%)',
        },
        containedSecondary: {
          background: 'linear-gradient(45deg, #3A5CAA 30%, #6e87dc 90%)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
        elevation1: {
          boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)',
        },
        elevation2: {
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          backgroundColor: 'rgba(58, 92, 170, 0.05)',
        },
      },
    },
  },
});

export default ensitTheme;
