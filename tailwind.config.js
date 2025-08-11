const forms = require('@tailwindcss/forms');

/** @type {import('tailwindcss').Config} */
module.exports = {
    // important: '.tailwind-scope',
    content: [
        "./src/pages/hrt-quiz.js",
        "./src/components/Quiz/**/*.{js,jsx,ts,tsx}",
        // Thêm các components khác khi cần
    ],
    theme: {
        extend: {
            // Map custom colors to Tailwind
            colors: {
                'primary': 'rgba(var(--color-background-primary), <alpha-value>)',
                'primary-highlighted': 'rgba(var(--color-background-primary-highlighted), <alpha-value>)',
                'primary-faded': 'rgba(var(--color-background-primary-faded), <alpha-value>)',
                'neutral': 'var(--color-foreground-neutral)',
                'neutral-faded': 'var(--color-foreground-neutral-faded)',
                'white': 'var(--color-white)',
                'black': 'var(--color-black)',
                'sage': 'rgba(var(--color-background-sage), <alpha-value>)',
                'sky': 'rgba(var(--color-background-sky), <alpha-value>)',
                'rust': 'rgba(var(--color-background-rust), <alpha-value>)',
                'poppy': 'rgba(var(--color-background-poppy), <alpha-value>)',
                'dark': 'rgba(var(--color-background-dark), <alpha-value>)',
                'warm': 'rgba(var(--color-background-warm), <alpha-value>)',
                'beige': 'rgba(var(--color-background-beige), <alpha-value>)',
                'page': 'rgba(var(--color-background-page), <alpha-value>)',
                'elevation-base': 'rgba(var(--color-background-elevation-base), <alpha-value>)',
                'elevation-raised': 'rgba(var(--color-background-elevation-raised), <alpha-value>)',
                'elevation-overlay': 'rgba(var(--color-background-elevation-overlay), <alpha-value>)',
                'critical': 'rgba(var(--color-background-critical), <alpha-value>)',
                'positive': 'rgba(var(--color-background-positive), <alpha-value>)',
            },
            
            // Custom spacing using CSS variables
            spacing: {
                'xs': 'var(--space-xs)',
                's': 'var(--space-s)', 
                'm': 'var(--space-m)',
                'l': 'var(--space-l)',
                'xl': 'var(--space-xl)',
                '2xl': 'var(--space-2xl)',
                '3xl': 'var(--space-3xl)',
                '4xl': 'var(--space-4xl)',
                '5xl': 'var(--space-5xl)',
                '6xl': 'var(--space-6xl)',
                '7xl': 'var(--space-7xl)',
                '8xl': 'var(--space-8xl)',
                '9xl': 'var(--space-9xl)',
                '2xs': 'var(--space-2xs)',
            },
            
            // Custom font sizes
            fontSize: {
                'xs': 'var(--size-xs)',
                's': 'var(--size-s)',
                'm': 'var(--size-m)',
                'l': 'var(--size-l)',
                'xl': 'var(--size-xl)',
                '2xl': 'var(--size-2xl)',
                '3xl': 'var(--size-3xl)',
                '4xl': 'var(--size-4xl)',
                '5xl': 'var(--size-5xl)',
                '6xl': 'var(--size-6xl)',
                '7xl': 'var(--size-7xl)',
                '8xl': 'var(--size-8xl)',
                '9xl': 'var(--size-9xl)',
            },
            
            // Custom container sizes
            maxWidth: {
                'container-xs': 'var(--container-xs)',
                'container-s': 'var(--container-s)',
                'container-m': 'var(--container-m)', 
                'container-l': 'var(--container-l)',
                'prose': 'var(--container-prose)',
            },
            
            // Custom border radius
            borderRadius: {
                'base': 'var(--radius)',
            },
            
            // Custom shadows
            boxShadow: {
                'raised': '0 5px 10px -3px var(--shadow-color)',
            },
            
            // Custom animations
            animation: {
                'glowing-border': 'slide-bottom 1.3s linear infinite',
                'shimmer': 'shimmer 2s infinite',
            },
            
            keyframes: {
                'slide-bottom': {
                    '0%': { left: '-100%' },
                    '100%': { left: '100%' },
                },
                'shimmer': {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' },
                },
            },
        },
    },
    plugins: [
        forms({
            strategy: 'class',
        }),
    ],
}