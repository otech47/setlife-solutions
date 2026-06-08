/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            backgroundSize: {
                '44': '11rem'
            },
            backgroundImage: {
                'bitcoin': 'url("https://setlife-solutions.s3.amazonaws.com/images/B+bitcoin.png")',
                // Brand teal gradient + a soft hero glow built from the same hue.
                'teal-gradient': 'linear-gradient(135deg, #00C2D4 0%, #0098A8 100%)',
                'teal-gradient-soft': 'linear-gradient(135deg, rgba(0,194,212,0.12) 0%, rgba(0,152,168,0.04) 100%)',
                'hero-glow': 'radial-gradient(60% 60% at 75% 35%, rgba(0,194,212,0.18) 0%, rgba(0,194,212,0) 70%)'
            },
            colors: {
                'primary': '#00C2D4',
                'primary-alt': 'rgba(0, 194, 212, 0.7)',
                // Darker teal for gradients, hovers and on-light contrast.
                'primary-dark': '#0098A8',
                // Very light teal wash for alternating section backgrounds.
                'primary-tint': '#ECFBFD',
                'solid-black': '#000000',
                'solid-white': '#FFFFFF',
                'light-gray': '#F2F2F2'
            },
            boxShadow: {
                // Quiet elevation for resting cards / sticky nav.
                'soft': '0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.06)',
                'card': '0 4px 24px -6px rgba(16,24,40,0.10), 0 2px 8px -3px rgba(16,24,40,0.06)',
                'card-hover': '0 22px 48px -16px rgba(16,24,40,0.22), 0 8px 18px -8px rgba(16,24,40,0.12)',
                // Tinted glow for the primary CTA + icon discs.
                'glow': '0 10px 28px -8px rgba(0,194,212,0.45)',
                'glow-lg': '0 18px 44px -12px rgba(0,194,212,0.55)'
            },
            keyframes: {
                'fade-up': {
                    '0%': { opacity: '0', transform: 'translateY(16px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' }
                }
            },
            animation: {
                'fade-up': 'fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
                'fade-up-slow': 'fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both'
            }
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
}
