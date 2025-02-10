import type { Config } from "tailwindcss";

export default {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)", // Custom background color from CSS variable
                foreground: "var(--foreground)", // Custom foreground color from CSS variable
            },
        },
    },
    darkMode: "class", // This enables dark mode toggling based on the 'dark' class on the body element
    plugins: [],
} satisfies Config;
