import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    primary: { main: '#248641' },
    secondary: { main: '#1261a3' },
  },
  typography: {
    htmlFontSize: 16,
    fontFamily: 'TheSansC5, Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    fontWeightMedium: 400,

    h1: {
      color: '#2B2B2B',
      fontSize: 32,
      fontWeight: 530,
    },
    h2: {
      color: '#4B4B4B',
      fontSize: 24,
      fontWeight: 530,
    },
    h3: {
      color: '#4B4B4B',
      fontSize: 18,
      fontWeight: 530,
    },
    h4: {
      fontSize: 18,
    },
    h5: {
      fontSize: 16,
    },
    h6: {
      fontSize: 14,
    },
    subtitle1: {
      fontSize: 24,
    },
    body1: {
      color: '#4B4B4B',
      fontWeight: 300,
      fontSize: 18,
    },
    body2: {
      color: '#4B4B4B',
      fontWeight: 300,
      fontSize: 16,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontSize: '1.125rem',
        },
        sizeSmall: {
          fontSize: '1rem',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          //       position: 'sticky',
          //       top: 63,
          //       borderColor: 'yellow',
          background: 'yellow',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 400,
          fontSize: '1rem',
          textTransform: 'none',
        },
      },
    },
  },
});
