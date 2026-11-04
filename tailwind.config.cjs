/** @type {import('tailwindcss').Config} */

/* ============================================================
   Premium White / Black / Red design system.
   Strict palette: White #FFFFFF | Black #0A0A0A | Red #E31E24
   Light Gray #F5F5F5 (surfaces) | Dark Gray #171717 (dark cards)
   ============================================================ */

// Brand red scale built around #E31E24. Every accent color family in
// the app is aliased to this scale so untouched legacy pages keep
// rendering in the cohesive black + white + red identity.
const brand = {
  // `DEFAULT` enables the bare `bg-brand`, `text-brand`, `border-brand`,
  // `ring-brand`, `from-brand` utilities used across the app.
  DEFAULT: '#e31e24',
  50: '#fdecee',
  100: '#fbd7da',
  200: '#f7afb6',
  300: '#f07d88',
  400: '#ea4a56',
  500: '#e31e24',
  600: '#c11a20',
  700: '#9c151a',
  800: '#7c1316',
  900: '#611214',
  950: '#360709',
}

// Neutral scale re-tinted to pure near-black #0A0A0A (removes zinc's
// blue cast). High numbers = dark surfaces, low numbers = light text.
const ink = {
  50: '#fafafa',
  100: '#f5f5f5',
  200: '#e5e5e5',
  300: '#d4d4d4',
  400: '#8a8a8f',
  500: '#6b6b70',
  600: '#4b4b50',
  700: '#2e2e33',
  800: '#171717',
  900: '#0f0f10',
  950: '#0a0a0a',
}

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core semantic tokens
        brand,
        'brand-dark': brand[600],
        'brand-soft': brand[50],
        paper: '#ffffff',
        surface: '#f5f5f5',
        card: '#171717',
        line: '#e5e5e5',
        ink: {
          DEFAULT: '#0a0a0a',
          soft: '#171717',
          muted: '#6b6b70',
          ...Object.fromEntries(Object.entries(ink).map(([k, v]) => [`s${k}`, v])),
        },
        // Neutral (dark) scale re-tinted to #0A0A0A base
        zinc: ink,
        gray: ink,
        neutral: ink,
        slate: ink,
        // All accent families -> brand red (white/black/red theme)
        emerald: brand,
        green: brand,
        teal: brand,
        lime: brand,
        cyan: brand,
        blue: brand,
        sky: brand,
        indigo: brand,
        violet: brand,
        purple: brand,
        fuchsia: brand,
        pink: brand,
        rose: brand,
        orange: brand,
        amber: brand,
        yellow: brand,
        red: brand,
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 2px rgba(10,10,10,0.04), 0 8px 24px rgba(10,10,10,0.06)',
        'card-hover': '0 4px 8px rgba(10,10,10,0.05), 0 16px 40px rgba(10,10,10,0.10)',
        'red-glow': '0 0 24px rgba(227,30,36,0.35)',
        'red-glow-lg': '0 0 48px rgba(227,30,36,0.45)',
      },
    },
  },
  plugins: [],
}
