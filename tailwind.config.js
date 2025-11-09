/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				"chill-blue": "#2FA1FF",
				"chill-blue-dark": "#298FE4",
				"chill-white": "#E5E5E5",
			},
		},
	},
	plugins: [],
};
