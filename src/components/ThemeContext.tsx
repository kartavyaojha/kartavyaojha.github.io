'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

interface ThemeContextValue {
  darkMode: boolean;
  motionEnabled: boolean;
  footerStirSignal: number;
  toggleDarkMode: () => void;
  toggleMotion: () => void;
  triggerFooterStir: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(true);
  const [motionEnabled, setMotionEnabled] = useState(true);
  const [footerStirSignal, setFooterStirSignal] = useState(0);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('ko-theme-v2');
      if (savedTheme === 'light') {
        setDarkMode(false);
        document.documentElement.classList.remove('dark');
      } else {
        setDarkMode(true);
        document.documentElement.classList.add('dark');
      }
      const savedMotion = localStorage.getItem('ko-motion');
      if (savedMotion === 'paused') {
        setMotionEnabled(false);
        document.documentElement.classList.add('motion-paused');
      }
    } catch {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle('dark', next);
      try {
        localStorage.setItem('ko-theme-v2', next ? 'dark' : 'light');
      } catch {
        // Ignore
      }
      return next;
    });
  }, []);

  const toggleMotion = useCallback(() => {
    setMotionEnabled((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle('motion-paused', !next);
      try {
        localStorage.setItem('ko-motion', next ? 'enabled' : 'paused');
      } catch {
        // Ignore
      }
      return next;
    });
  }, []);

  const triggerFooterStir = useCallback(() => {
    setFooterStirSignal((prev) => prev + 1);
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        motionEnabled,
        footerStirSignal,
        toggleDarkMode,
        toggleMotion,
        triggerFooterStir,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}
