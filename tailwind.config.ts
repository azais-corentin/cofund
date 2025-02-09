import type { Config } from 'tailwindcss';

/** @type {import('tailwindcss').Config} */

const config: Config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {}
	},
	plugins: []
};

export default config;
