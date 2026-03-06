import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg:           'var(--color-bg)',
        panel:        'var(--color-panel)',
        border:       'var(--color-border)',
        accent:       'var(--color-accent)',
        'accent-hover': 'var(--color-accent-hover)',
        accent2:      'var(--color-accent2)',
        text:         'var(--color-text)',
        muted:        'var(--color-muted)',
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        vt:    ['VT323', 'monospace'],
        body:  ['"DM Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
