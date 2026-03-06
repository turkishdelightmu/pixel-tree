'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

// Day = 08:00–18:00 local time → light theme
const DAY_START = 8;
const DAY_END   = 18;
const STORAGE_KEY = 'pixel-tree-theme';

type Mode = 'light' | 'dark';

function autoMode(): Mode {
  const h = new Date().getHours();
  return h >= DAY_START && h < DAY_END ? 'light' : 'dark';
}

/** Milliseconds until the next whole-hour boundary */
function msUntilNextHour(): number {
  const now = new Date();
  return (60 - now.getMinutes()) * 60_000 - now.getSeconds() * 1000 - now.getMilliseconds();
}

interface ThemeContextValue {
  mode: Mode;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({ mode: 'light', toggle: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>('light');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Apply the mode class to <html>
  const applyMode = useCallback((m: Mode) => {
    if (m === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    setMode(m);
  }, []);

  // Schedule re-evaluation at the next hour boundary (auto-only)
  const scheduleNextCheck = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const override = localStorage.getItem(STORAGE_KEY) as Mode | null;
      if (!override) applyMode(autoMode());
      scheduleNextCheck();
    }, msUntilNextHour());
  }, [applyMode]);

  // On mount: read override or fall back to auto
  useEffect(() => {
    const override = localStorage.getItem(STORAGE_KEY) as Mode | null;
    applyMode(override ?? autoMode());
    scheduleNextCheck();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [applyMode, scheduleNextCheck]);

  const toggle = useCallback(() => {
    const next: Mode = mode === 'dark' ? 'light' : 'dark';
    const auto = autoMode();
    if (next === auto) {
      // Override matches auto — clear it so the app reverts to automatic
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, next);
    }
    applyMode(next);
  }, [mode, applyMode]);

  return (
    <ThemeContext.Provider value={{ mode, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
