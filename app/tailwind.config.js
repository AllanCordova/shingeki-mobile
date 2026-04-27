/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./components/**/*.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        surface: "var(--surface)",
        "surface-container-lowest": "var(--surface-container-lowest)",
        "surface-container-low": "var(--surface-container-low)",
        "surface-container": "var(--surface-container)",
        "surface-container-high": "var(--surface-container-high)",
        "surface-container-highest": "var(--surface-container-highest)",
        "surface-variant": "var(--surface-variant)",
        "surface-bright": "var(--surface-bright)",
        primary: "var(--primary)",
        "primary-container": "var(--primary-container)",
        "secondary-container": "var(--secondary-container)",
        error: "var(--error)",
        "error-container": "var(--error-container)",
        "on-background": "var(--on-background)",
        "on-surface": "var(--on-surface)",
        "on-surface-variant": "var(--on-surface-variant)",
        outline: "var(--outline)",
        "outline-variant": "var(--outline-variant)",
      },
      fontFamily: {
        headline: ["Space Grotesk"],
        body: ["Inter"],
        label: ["Space Grotesk"],
      },
    },
  },
  plugins: [],
};
