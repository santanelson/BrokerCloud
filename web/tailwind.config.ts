import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // BrokerCloud Design System — Material You tokens (dark)
        primary: "#4edea3",
        "primary-container": "#10b981",
        "on-primary": "#003824",
        "on-primary-container": "#00422b",
        "primary-fixed": "#6ffbbe",
        "primary-fixed-dim": "#4edea3",
        "inverse-primary": "#006c49",
        "on-primary-fixed": "#002113",
        "on-primary-fixed-variant": "#005236",

        secondary: "#adc6ff",
        "secondary-container": "#0566d9",
        "on-secondary": "#002e6a",
        "on-secondary-container": "#e6ecff",
        "secondary-fixed": "#d8e2ff",
        "secondary-fixed-dim": "#adc6ff",
        "on-secondary-fixed": "#001a42",
        "on-secondary-fixed-variant": "#004395",

        tertiary: "#ffb3af",
        "tertiary-container": "#fc7c78",
        "on-tertiary": "#650911",
        "on-tertiary-container": "#711419",
        "tertiary-fixed": "#ffdad7",
        "tertiary-fixed-dim": "#ffb3af",
        "on-tertiary-fixed": "#410005",
        "on-tertiary-fixed-variant": "#842225",

        surface: "#0e1511",
        "surface-dim": "#0e1511",
        "surface-bright": "#343b36",
        "surface-container-lowest": "#09100c",
        "surface-container-low": "#161d19",
        "surface-container": "#1a211d",
        "surface-container-high": "#242c27",
        "surface-container-highest": "#2f3632",
        "surface-variant": "#2f3632",
        "surface-tint": "#4edea3",
        background: "#0e1511",

        "on-surface": "#dde4dd",
        "on-surface-variant": "#bbcabf",
        "on-background": "#dde4dd",
        "inverse-surface": "#dde4dd",
        "inverse-on-surface": "#2b322d",

        outline: "#86948a",
        "outline-variant": "#3c4a42",

        error: "#ffb4ab",
        "error-container": "#93000a",
        "on-error": "#690005",
        "on-error-container": "#ffdad6",
      },
      borderRadius: {
        sm: "0.25rem",
        DEFAULT: "0.375rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.25rem",
        full: "9999px",
      },
      spacing: {
        gutter: "16px",
        unit: "8px",
        "container-padding": "24px",
        "margin-desktop": "32px",
        "margin-mobile": "16px",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Manrope", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        manrope: ["Manrope", "sans-serif"],
      },
      fontSize: {
        "label-sm": ["11px", { lineHeight: "14px", letterSpacing: "0.06em", fontWeight: "600" }],
        "label-md": ["12px", { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "600" }],
        "body-sm": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "headline-sm": ["20px", { lineHeight: "28px", fontWeight: "600" }],
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "headline-lg": ["28px", { lineHeight: "36px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "headline-xl": ["36px", { lineHeight: "44px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-sm": ["45px", { lineHeight: "52px", letterSpacing: "-0.02em", fontWeight: "800" }],
      },
      keyframes: {
        "slide-in": {
          from: { transform: "translateX(-100%)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-ring": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(78, 222, 163, 0.4)" },
          "50%": { boxShadow: "0 0 0 8px rgba(78, 222, 163, 0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },
      animation: {
        "slide-in": "slide-in 0.3s ease-out",
        "fade-up": "fade-up 0.2s ease-out",
        "pulse-ring": "pulse-ring 2s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      boxShadow: {
        glow: "0 0 20px rgba(78, 222, 163, 0.15)",
        "glow-lg": "0 8px 32px rgba(78, 222, 163, 0.25)",
        "glow-error": "0 0 20px rgba(255, 180, 171, 0.2)",
      },
    },
  },
  plugins: [],
};

export default config;
