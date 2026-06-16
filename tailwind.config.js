/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Mono"', 'monospace'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        emerald: {
          soft: '#A7C4A0',
          dark: '#4A7C59',
        },
        accent: '#2E7D4F',
        surface: '#F5F5F5',
        'text-primary': '#333333',
        'border-light': '#E0E0E0',
        // DARK MODE
        'dark-bg': '#1a1a2e',
        'dark-surface': '#16213e',
        'dark-card': '#1e2a4a',
        'dark-border': '#2a3a5c',
        'dark-text': '#e0e0e0',
        'dark-muted': '#8899aa',
      },
    },
  },
  plugins: [],
};
