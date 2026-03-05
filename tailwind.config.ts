import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg:      '#0a0e1a',
        panel:   '#0f1628',
        border:  '#1e2d50',
        accent:  '#00ff9d',
        accent2: '#7c5cff',
        text:    '#c8d8f0',
        muted:   '#4a6080',
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
