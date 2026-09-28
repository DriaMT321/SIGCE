/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Outfit', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        brand: {
          50: '#fff5f5',
          100: '#ffe1e4',
          200: '#ffc8cd',
          300: '#ffa1aa',
          400: '#f86d7c',
          500: '#ee394d',
          600: '#db1d33',
          700: '#b91329', // Official School Carmine/Red
          800: '#9b1325',
          900: '#821424',
          950: '#47050e',
          // Institutional Palette from School Stylesheet
          crimson: '#b91329', // Exact Institutional Red
          orange: '#f37022',  // Exact Institutional Orange
          gold: '#ffc54c',    // Exact Institutional Amber/Gold
          amber: '#f37b1f',
          yellow: '#f8c311',
          garnet: '#881337',
          // Backward compatibility mappings
          red: '#b91329',
          darkred: '#821424',
        },
      },
      backgroundImage: {
        'institutional-radial': 'radial-gradient(circle at 100% 0%, #ffc54c 0%, #ffb946 12.5%, #ffa93d 25%, #fe9430 37.5%, #f37b1f 50%, #e76010 62.5%, #df470c 75%, #da2e11 87.5%, #d8091a 100%)',
        'institutional-linear': 'linear-gradient(135deg, #ffc54c 0%, #f37022 50%, #b91329 100%)',
        'institutional-subtle': 'linear-gradient(135deg, #fffbf0 0%, #fff7ed 50%, #fff1f2 100%)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02)',
        'elevated': '0 4px 6px -1px rgba(0, 0, 0, 0.04), 0 2px 4px -2px rgba(0, 0, 0, 0.03)',
        'card': '0 0 0 1px rgba(226, 232, 240, 0.8), 0 2px 4px rgba(0, 0, 0, 0.02)',
        'card-hover': '0 0 0 1px rgba(185, 28, 28, 0.2), 0 8px 20px -4px rgba(185, 28, 28, 0.06)',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}

