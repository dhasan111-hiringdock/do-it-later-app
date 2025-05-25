
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '1rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#10B981', // Mint green
					foreground: '#ffffff'
				},
				secondary: {
					DEFAULT: '#F3F4F6',
					foreground: '#374151'
				},
				destructive: {
					DEFAULT: '#EF4444',
					foreground: '#ffffff'
				},
				muted: {
					DEFAULT: '#F9FAFB',
					foreground: '#6B7280'
				},
				accent: {
					DEFAULT: '#FCD34D', // Yellow accent
					foreground: '#92400E'
				},
				popover: {
					DEFAULT: '#ffffff',
					foreground: '#374151'
				},
				card: {
					DEFAULT: '#ffffff',
					foreground: '#374151'
				},
				// DoLater brand colors
				dolater: {
					mint: '#10B981',
					yellow: '#FCD34D',
					'mint-light': '#D1FAE5',
					'mint-dark': '#047857',
					gray: '#F3F4F6',
					'text-primary': '#111827',
					'text-secondary': '#6B7280'
				},
				// Category colors (Trello-style)
				category: {
					urgent: '#EF4444',
					knowledge: '#3B82F6',
					fitness: '#10B981',
					finance: '#8B5CF6',
					personal: '#F59E0B',
					work: '#6366F1',
					entertainment: '#EC4899',
					food: '#F97316'
				}
			},
			borderRadius: {
				lg: '12px',
				md: '8px',
				sm: '6px'
			},
			keyframes: {
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'slide-up': {
					'0%': { transform: 'translateY(100%)' },
					'100%': { transform: 'translateY(0)' }
				},
				'scale-in': {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				}
			},
			animation: {
				'fade-in': 'fade-in 0.3s ease-out',
				'slide-up': 'slide-up 0.3s ease-out',
				'scale-in': 'scale-in 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
