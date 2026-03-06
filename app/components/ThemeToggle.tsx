'use client';

import { useTheme } from './ThemeProvider';

export default function ThemeToggle() {
  const { mode, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="fixed bottom-6 right-6 z-50 w-10 h-10 flex items-center justify-center
                 border-2 border-border bg-panel text-text
                 hover:border-accent hover:text-accent
                 transition-all duration-200 cursor-pointer
                 shadow-lg"
      style={{ fontSize: '18px' }}
    >
      {mode === 'dark' ? '☀' : '🌙'}
    </button>
  );
}
