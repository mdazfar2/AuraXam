import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext(undefined);

const STORAGE_KEY = 'auraxam_theme_mode';

const readStoredMode = () => {
  try {
    const mode = window.localStorage.getItem(STORAGE_KEY);
    return mode === 'dark' || mode === 'light' ? mode : null;
  } catch {
    return null;
  }
};

const resolveInitialMode = () => {
  const stored = readStoredMode();
  if (stored) return stored;

  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  return 'light';
};

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(resolveInitialMode);

  useEffect(() => {
    const root = document.documentElement;

    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // Ignore storage errors.
    }
  }, [mode]);

  const toggleTheme = () => {
    setMode((currentMode) => (currentMode === 'light' ? 'dark' : 'light'));
  };

  const value = useMemo(
    () => ({
      theme: {
        mode,
        primaryColor: '#2563eb',
        accentColor: '#9333ea'
      },
      toggleTheme
    }),
    [mode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};
