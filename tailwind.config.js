/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				"chill-yellow": "#fad710",
				"chill-white": "#2fa1ff",
			},
		},
	},
	plugins: [],
};
