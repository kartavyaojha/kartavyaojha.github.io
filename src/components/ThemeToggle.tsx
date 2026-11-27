'use client';

import React from 'react';
import { useTheme } from './ThemeContext';

export function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <div className="theme-switch-wrap">
      <button
        type="button"
        role="switch"
        aria-checked={darkMode}
        aria-label={darkMode ? 'Back to paper (light mode)' : 'Add some sparkle (dark mode)'}
        onClick={toggleDarkMode}
        className="theme-switch-btn inline-flex items-center gap-3 focus:outline-none"
      >
        <span className="theme-switch-label" aria-hidden="true">
          {darkMode ? 'Back to paper' : 'Add some sparkle'}
        </span>
        <span className="theme-switch-track" aria-hidden="true">
          <span className="theme-switch-knob" />
        </span>
      </button>
    </div>
  );
}
