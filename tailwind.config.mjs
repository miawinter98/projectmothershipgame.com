/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme'

export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				'primary': 'rgb(var(--primary) / <alpha-value>)',
				'secondary': 'rgb(var(--secondary) / <alpha-value>)',
				'accent': 'rgb(var(--accent) / <alpha-value>)',
				'background': 'rgb(var(--background) / <alpha-value>)',
				'text': 'rgb(var(--text) / <alpha-value>)',
			}
		},
		fontSize: {
			sm: '0.750rem',
			base: '1rem',
			lg: '1.2rem',
			xl: '1.333rem',
			'2xl': '1.777rem',
			'3xl': '2.369rem',
			'4xl': '3.158rem',
			'5xl': '4.210rem',
		},
		fontFamily: {
			'sans': ['Chakra Petch', ...defaultTheme.fontFamily.sans],
			'pixel': "Pixelify Sans"
		}
	},
	plugins: [],
}
