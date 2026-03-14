import React, { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
  moodColor: string;
  setMoodColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [moodColor, setMoodColorState] = useState('#7c6bff');

  const setMoodColor = (color: string) => {
    setMoodColorState(color);
    document.documentElement.style.setProperty('--bg-ambient-1', color + '22');
  };

  useEffect(() => {
    const savedMood = localStorage.getItem('lumis_last_mood_color');
    if (savedMood) {
      setMoodColor(savedMood);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ moodColor, setMoodColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
