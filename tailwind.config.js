/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: ['class', '[data-theme="dark"]'],
    theme: {
        extend: {
            colors: {
                bg: {
                    base: 'var(--bg-base)',
                    surface: 'var(--bg-surface)',
                    elevated: 'var(--bg-elevated)',
                    hover: 'var(--bg-hover)',
                    active: 'var(--bg-active)',
                    overlay: 'var(--bg-overlay)',
                },
                text: {
                    primary: 'var(--text-primary)',
                    secondary: 'var(--text-secondary)',
                    muted: 'var(--text-muted)',
                    disabled: 'var(--text-disabled)',
                },
                border: {
                    subtle: 'var(--border-subtle)',
                    default: 'var(--border-default)',
                    strong: 'var(--border-strong)',
                },
                primary: {
                    50: 'var(--primary-50)',
                    100: 'var(--primary-100)',
                    200: 'var(--primary-200)',
                    300: 'var(--primary-300)',
                    400: 'var(--primary-400)',
                    500: 'var(--primary-500)',
                    600: 'var(--primary-600)',
                    700: 'var(--primary-700)',
                    glow: 'var(--primary-glow)',
                },
                accent: {
                    400: 'var(--accent-400)',
                    500: 'var(--accent-500)',
                    600: 'var(--accent-600)',
                },
                success: {
                    500: 'var(--success-500)',
                    600: 'var(--success-600)',
                },
                warning: {
                    500: 'var(--warning-500)',
                    600: 'var(--warning-600)',
                },
                error: {
                    500: 'var(--error-500)',
                    600: 'var(--error-600)',
                },
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            boxShadow: {
                glow: 'var(--shadow-glow)',
            }
        },
    },
    plugins: [],
}
