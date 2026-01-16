import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

const config: Config = {
	darkMode: ['class'],
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		container: {
			center: true,
			padding: '1.5rem',
			screens: {
				'2xl': '1440px',
			},
		},
		extend: {
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
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
				success: '#00c481',
				warning: '#f6ab27',
				danger: '#f04438',
				brand: {
					deep: '#002b59',
					primary: '#0051b6',
					secondary: '#00b8ce',
					pale: '#f0f6fb',
				},
				chart: {
					1: 'hsl(var(--chart-1))',
					2: 'hsl(var(--chart-2))',
					3: 'hsl(var(--chart-3))',
					4: 'hsl(var(--chart-4))',
					5: 'hsl(var(--chart-5))',
				},
				// Surface colors for layered UI
				surface: {
					1: 'hsl(var(--surface-1))',
					2: 'hsl(var(--surface-2))',
					3: 'hsl(var(--surface-3))',
				},
			},
			borderRadius: {
				'2xl': '1.5rem',
				xl: '1.25rem',
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
				'fade-in': {
					from: { opacity: '0' },
					to: { opacity: '1' },
				},
				'fade-out': {
					from: { opacity: '1' },
					to: { opacity: '0' },
				},
				'slide-in-from-top': {
					from: { transform: 'translateY(-10px)', opacity: '0' },
					to: { transform: 'translateY(0)', opacity: '1' },
				},
				'slide-in-from-bottom': {
					from: { transform: 'translateY(10px)', opacity: '0' },
					to: { transform: 'translateY(0)', opacity: '1' },
				},
				'slide-in-from-left': {
					from: { transform: 'translateX(-10px)', opacity: '0' },
					to: { transform: 'translateX(0)', opacity: '1' },
				},
				'slide-in-from-right': {
					from: { transform: 'translateX(10px)', opacity: '0' },
					to: { transform: 'translateX(0)', opacity: '1' },
				},
				'scale-in': {
					from: { transform: 'scale(0.95)', opacity: '0' },
					to: { transform: 'scale(1)', opacity: '1' },
				},
				'scale-out': {
					from: { transform: 'scale(1)', opacity: '1' },
					to: { transform: 'scale(0.95)', opacity: '0' },
				},
				shimmer: {
					from: { backgroundPosition: '-200% 0' },
					to: { backgroundPosition: '200% 0' },
				},
				pulse: {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.5' },
				},
				'pulse-ring': {
					'0%': { transform: 'scale(0.8)', opacity: '0.8' },
					'100%': { transform: 'scale(2)', opacity: '0' },
				},
				float: {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' },
				},
				'bounce-subtle': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-3px)' },
				},
				wiggle: {
					'0%, 100%': { transform: 'rotate(-1deg)' },
					'50%': { transform: 'rotate(1deg)' },
				},
				'spin-slow': {
					from: { transform: 'rotate(0deg)' },
					to: { transform: 'rotate(360deg)' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'fade-out': 'fade-out 0.3s ease-out',
				'slide-in-from-top': 'slide-in-from-top 0.3s ease-out',
				'slide-in-from-bottom': 'slide-in-from-bottom 0.3s ease-out',
				'slide-in-from-left': 'slide-in-from-left 0.3s ease-out',
				'slide-in-from-right': 'slide-in-from-right 0.3s ease-out',
				'scale-in': 'scale-in 0.2s ease-out',
				'scale-out': 'scale-out 0.2s ease-out',
				shimmer: 'shimmer 2s linear infinite',
				pulse: 'pulse 2s ease-in-out infinite',
				'pulse-ring': 'pulse-ring 1.5s ease-out infinite',
				float: 'float 3s ease-in-out infinite',
				'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
				wiggle: 'wiggle 0.3s ease-in-out',
				'spin-slow': 'spin-slow 8s linear infinite',
			},
			boxShadow: {
				floating: '0 15px 35px -20px rgba(0, 40, 90, 0.45)',
				'glass': '0 8px 32px rgba(0, 40, 90, 0.12)',
				'glass-lg': '0 16px 48px rgba(0, 40, 90, 0.16)',
				'inner-light': 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
				'glow-primary': '0 0 20px rgba(0, 81, 182, 0.3)',
				'glow-secondary': '0 0 20px rgba(0, 184, 206, 0.3)',
				'glow-success': '0 0 20px rgba(0, 196, 129, 0.3)',
				'glow-danger': '0 0 20px rgba(240, 68, 56, 0.3)',
			},
			backdropBlur: {
				xs: '2px',
			},
			transitionDuration: {
				'400': '400ms',
			},
			transitionTimingFunction: {
				'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
				'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
			},
		},
	},
	plugins: [animate],
}

export default config
