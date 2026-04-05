import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        code: {
          bg: "hsl(var(--code-bg))",
          border: "hsl(var(--code-border))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        "surface-tint": "#4edea3",
        "inverse-surface": "#e2e2e8",
        "on-tertiary-container": "#711419",
        "surface-container": "#1e2024",
        "on-surface": "#e2e2e8",
        "on-secondary": "#002e6a",
        "surface-container-low": "#1a1c20",
        "on-primary-container": "#00422b",
        "tertiary": "#ffb3af",
        "inverse-on-surface": "#2f3035",
        "on-secondary-container": "#e6ecff",
        "on-background": "#e2e2e8",
        "on-error": "#690005",
        "tertiary-fixed": "#ffdad7",
        "secondary-container": "#0566d9",
        "tertiary-fixed-dim": "#ffb3af",
        "primary-fixed-dim": "#4edea3",
        "on-primary": "#003824",
        "on-tertiary-fixed-variant": "#842225",
        "secondary-fixed-dim": "#adc6ff",
        "outline-variant": "#3c4a42",
        "inverse-primary": "#006c49",
        "error-container": "#93000a",
        "error": "#ffb4ab",
        "surface-bright": "#37393e",
        "outline": "#86948a",
        "on-secondary-fixed-variant": "#004395",
        "on-primary-fixed": "#002113",
        "surface-variant": "#333539",
        "surface-container-lowest": "#0c0e12",
        "on-tertiary-fixed": "#410005",
        "on-tertiary": "#650911",
        "surface": "#111318",
        "on-primary-fixed-variant": "#005236",
        "surface-container-highest": "#333539",
        "primary-container": "#10b981",
        "on-error-container": "#ffdad6",
        "surface-container-high": "#282a2e",
        "primary-fixed": "#6ffbbe",
        "tertiary-container": "#fc7c78",
        "surface-dim": "#111318",
        "secondary-fixed": "#d8e2ff",
        "on-surface-variant": "#bbcabf",
        "on-secondary-fixed": "#001a42",
      },
      backgroundImage: {
        "gradient-primary": "var(--gradient-primary)",
        "gradient-accent": "var(--gradient-accent)",
        "gradient-hero": "var(--gradient-hero)",
      },
      fontFamily: {
        "headline": ["Space Grotesk", "sans-serif"],
        "body": ["Manrope", "sans-serif"],
        "label": ["Manrope", "sans-serif"],
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        medium: "var(--shadow-medium)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
