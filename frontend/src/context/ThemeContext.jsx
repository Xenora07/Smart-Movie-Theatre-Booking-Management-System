import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const THEMES = {
  CINEMA: 'cinema',
  BLUE: 'blue'
};

export const MODES = {
  DARK: 'dark',
  LIGHT: 'light'
};

const STORAGE_KEY_MODE = 'cinewave_theme_mode';
const STORAGE_KEY_LIGHT_THEME = 'cinewave_light_theme';

export const ThemeProvider = ({ children }) => {
  // Initialize mode: 'dark' or 'light' (default to 'dark' to preserve existing CineWave dark mode)
  const [mode, setModeState] = useState(() => {
    try {
      const savedMode = localStorage.getItem(STORAGE_KEY_MODE);
      if (savedMode === MODES.DARK || savedMode === MODES.LIGHT) {
        return savedMode;
      }
    } catch (e) {
      // localStorage may be disabled in restricted environments
    }
    return MODES.DARK;
  });

  // Initialize light theme style: 'cinema' or 'blue' (default to 'cinema' per PPT requirement)
  const [lightTheme, setLightThemeState] = useState(() => {
    try {
      const savedTheme = localStorage.getItem(STORAGE_KEY_LIGHT_THEME);
      if (savedTheme === THEMES.CINEMA || savedTheme === THEMES.BLUE) {
        return savedTheme;
      }
    } catch (e) {
      // localStorage fallback
    }
    return THEMES.CINEMA;
  });

  // Synchronize DOM attributes with state immediately
  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-mode', mode);
      document.documentElement.setAttribute('data-theme', lightTheme);
      localStorage.setItem(STORAGE_KEY_MODE, mode);
      localStorage.setItem(STORAGE_KEY_LIGHT_THEME, lightTheme);
    } catch (e) {
      // ignore storage errors
    }
  }, [mode, lightTheme]);

  // Toggle between dark and light modes
  const toggleMode = () => {
    setModeState((prev) => (prev === MODES.DARK ? MODES.LIGHT : MODES.DARK));
  };

  // Explicitly set mode
  const setMode = (newMode) => {
    if (newMode === MODES.DARK || newMode === MODES.LIGHT) {
      setModeState(newMode);
    }
  };

  // Explicitly set light theme style ('cinema' or 'blue')
  const setLightTheme = (newTheme) => {
    if (newTheme === THEMES.CINEMA || newTheme === THEMES.BLUE) {
      setLightThemeState(newTheme);
      // If user chooses a light theme style while in dark mode, switch them to light mode
      // so the chosen theme is immediately visible
      if (mode === MODES.DARK) {
        setModeState(MODES.LIGHT);
      }
    }
  };

  // Quick select helper: 'dark', 'cinema', 'blue'
  const selectTheme = (themeId) => {
    if (themeId === 'dark') {
      setModeState(MODES.DARK);
    } else if (themeId === THEMES.CINEMA) {
      setLightThemeState(THEMES.CINEMA);
      setModeState(MODES.LIGHT);
    } else if (themeId === THEMES.BLUE) {
      setLightThemeState(THEMES.BLUE);
      setModeState(MODES.LIGHT);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        mode,
        lightTheme,
        isDark: mode === MODES.DARK,
        isLight: mode === MODES.LIGHT,
        isCinema: lightTheme === THEMES.CINEMA,
        isBlue: lightTheme === THEMES.BLUE,
        toggleMode,
        setMode,
        setLightTheme,
        selectTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
