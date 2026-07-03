import { createTheme } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';

const baseThemeOptions: ThemeOptions = {
  typography: {
    fontFamily: '"Outfit", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em' },
    h3: { fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-0.01em' },
    h4: { fontSize: '1.25rem', fontWeight: 600, letterSpacing: '-0.01em' },
    h5: { fontSize: '1.1rem', fontWeight: 600 },
    h6: { fontSize: '1rem', fontWeight: 600 },
    subtitle1: { fontSize: '1rem', fontWeight: 500 },
    subtitle2: { fontSize: '0.875rem', fontWeight: 500 },
    body1: { fontSize: '1rem', lineHeight: 1.5 },
    body2: { fontSize: '0.875rem', lineHeight: 1.5 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: ({ theme }) => ({
          fontWeight: 600,
          backgroundColor: theme.palette.mode === 'light' ? '#F1F5F9' : '#0F172A',
          borderBottom: `2px solid ${theme.palette.divider}`,
        }),
      },
    },
  },
};

export const lightTheme = createTheme({
  ...baseThemeOptions,
  palette: {
    mode: 'light',
    primary: {
      main: '#6366F1', // Indigo
      light: '#818CF8',
      dark: '#4F46E5',
    },
    secondary: {
      main: '#EC4899', // Pink
      light: '#F472B6',
      dark: '#DB2777',
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0F172A',
      secondary: '#475569',
    },
    divider: '#E2E8F0',
  },
  components: {
    ...baseThemeOptions.components,
    MuiCard: {
      styleOverrides: {
        root: {
          ...baseThemeOptions.components?.MuiCard?.styleOverrides,
          border: '1px solid #E2E8F0',
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  ...baseThemeOptions,
  palette: {
    mode: 'dark',
    primary: {
      main: '#818CF8', // Indigo light
      light: '#A5B4FC',
      dark: '#4F46E5',
    },
    secondary: {
      main: '#F472B6', // Pink light
      light: '#FBCFE8',
      dark: '#DB2777',
    },
    background: {
      default: '#0F172A', // Deep slate blue
      paper: '#1E293B',
    },
    text: {
      primary: '#F8FAFC',
      secondary: '#94A3B8',
    },
    divider: '#334155',
  },
  components: {
    ...baseThemeOptions.components,
    MuiCard: {
      styleOverrides: {
        root: {
          ...baseThemeOptions.components?.MuiCard?.styleOverrides,
          border: '1px solid #334155',
          backgroundColor: 'rgba(30, 41, 59, 0.7)',
          backdropFilter: 'blur(12px)',
        },
      },
    },
  },
});
