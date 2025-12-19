import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: 'class',
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#FFFFFF", // Pure white
                foreground: "#0F172A", // Slate-900 (Deep text)
                primary: {
                    DEFAULT: "#4F46E5", // Indigo-600
                    foreground: "#FFFFFF",
                },
                muted: {
                    DEFAULT: "#F8FAFC", // Slate-50
                    foreground: "#64748B", // Slate-500
                },
                slate: {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569', // Body text
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a', // Headings
                }
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
            },
            borderRadius: {
                'xl': '0.75rem',
                '2xl': '1rem',
                '3xl': '1.5rem',
                '4xl': '2rem',
            },
            boxShadow: {
                'soft': '0 2px 10px rgba(0, 0, 0, 0.03)',
                'card': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
                'glow': '0 0 20px rgba(79, 70, 229, 0.35)',
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }
        },
    },
    plugins: [],
};
export default config;
