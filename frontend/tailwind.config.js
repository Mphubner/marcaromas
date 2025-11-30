/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {
				/* Brand Colors - Marc Aromas */
				brand: {
					primary: '#8B6B4C',
					secondary: '#A98B74',
					dark: '#403225',
					light: '#F5F0EC',
					accent: '#D4A574',
					muted: '#A1917F',
				},

				/* Extended Palette */
				purple: {
					light: '#F3E8FF',
					DEFAULT: '#9333EA',
					dark: '#6B21A8',
				},
				pink: {
					light: '#FCE7F3',
					DEFAULT: '#EC4899',
					dark: '#BE185D',
				},
				emerald: {
					light: '#D1FAE5',
					DEFAULT: '#10B981',
					dark: '#065F46',
				},
				amber: {
					light: '#FEF3C7',
					DEFAULT: '#F59E0B',
					dark: '#92400E',
				},

				/* UI Colors */
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
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
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))',
				},
			},

			fontFamily: {
				sans: ['Inter', 'Outfit', 'system-ui', 'sans-serif'],
				display: ['Playfair Display', 'Georgia', 'serif'],
				body: ['Inter', 'system-ui', 'sans-serif'],
			},

			fontSize: {
				'xs': ['0.75rem', { lineHeight: '1rem' }],
				'sm': ['0.875rem', { lineHeight: '1.25rem' }],
				'base': ['1rem', { lineHeight: '1.5rem' }],
				'lg': ['1.125rem', { lineHeight: '1.75rem' }],
				'xl': ['1.25rem', { lineHeight: '1.75rem' }],
				'2xl': ['1.5rem', { lineHeight: '2rem' }],
				'3xl': ['1.875rem', { lineHeight: '2.25rem' }],
				'4xl': ['2.25rem', { lineHeight: '2.5rem' }],
				'5xl': ['3rem', { lineHeight: '1.16' }],
				'6xl': ['3.75rem', { lineHeight: '1.16' }],
				'7xl': ['4.5rem', { lineHeight: '1.16' }],
			},

			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
				'gradient-primary': 'linear-gradient(135deg, var(--tw-gradient-stops))',
				'gradient-warm': 'linear-gradient(135deg, #FFB88C 0%, #DE6262 100%)',
				'gradient-luxury': 'linear-gradient(135deg, #8B6B4C 0%, #D4A574 50%, #8B6B4C 100%)',
				'gradient-shimmer': 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
			},

			animation: {
				// Entrance Animations
				'fade-in': 'fadeIn 0.5s ease-in-out',
				'slide-up': 'slideUp 0.5s ease-out',
				'slide-down': 'slideDown 0.3s ease-out',
				'slide-in-left': 'slideInLeft 0.5s ease-out',
				'slide-in-right': 'slideInRight 0.5s ease-out',
				'scale-in': 'scaleIn 0.3s ease-out',

				// Continuous Animations
				'shimmer': 'shimmer 2s infinite linear',
				'float': 'float 3s ease-in-out infinite',
				'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'spin-slow': 'spin 3s linear infinite',

				// Micro-interactions
				'bounce-subtle': 'bounceSubtle 0.5s ease-in-out',
				'wiggle': 'wiggle 0.5s ease-in-out',
			},

			keyframes: {
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
				slideUp: {
					'0%': {
						transform: 'translateY(20px)',
						opacity: '0',
					},
					'100%': {
						transform: 'translateY(0)',
						opacity: '1',
					},
				},
				slideDown: {
					'0%': {
						transform: 'translateY(-10px)',
						opacity: '0',
					},
					'100%': {
						transform: 'translateY(0)',
						opacity: '1',
					},
				},
				slideInLeft: {
					'0%': {
						transform: 'translateX(-20px)',
						opacity: '0',
					},
					'100%': {
						transform: 'translateX(0)',
						opacity: '1',
					},
				},
				slideInRight: {
					'0%': {
						transform: 'translateX(20px)',
						opacity: '0',
					},
					'100%': {
						transform: 'translateX(0)',
						opacity: '1',
					},
				},
				scaleIn: {
					'0%': {
						transform: 'scale(0.95)',
						opacity: '0',
					},
					'100%': {
						transform: 'scale(1)',
						opacity: '1',
					},
				},
				shimmer: {
					'0%': { backgroundPosition: '-1000px 0' },
					'100%': { backgroundPosition: '1000px 0' },
				},
				float: {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' },
				},
				bounceSubtle: {
					'0%, 100%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.05)' },
				},
				wiggle: {
					'0%, 100%': { transform: 'rotate(0deg)' },
					'25%': { transform: 'rotate(-3deg)' },
					'75%': { transform: 'rotate(3deg)' },
				},
			},

			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},

			spacing: {
				'18': '4.5rem',
				'88': '22rem',
				'100': '25rem',
				'112': '28rem',
				'128': '32rem',
			},

			boxShadow: {
				'soft': '0 2px 8px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04)',
				'medium': '0 4px 16px rgba(0, 0, 0, 0.12), 0 8px 32px rgba(0, 0, 0, 0.06)',
				'strong': '0 8px 32px rgba(0, 0, 0, 0.16), 0 16px 64px rgba(0, 0, 0, 0.08)',
				'glow': '0 0 20px rgba(212, 165, 116, 0.4), 0 0 40px rgba(212, 165, 116, 0.2)',
				'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
			},

			backdropBlur: {
				xs: '2px',
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
}