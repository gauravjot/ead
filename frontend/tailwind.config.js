/* eslint-env node */
/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class", "class"],
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				serif: ['Merriweather"', "Merriweather", "Times New Roman", "Georgia", "serif"],
				sans: ['"Geist"', "Geist", "Arial", "sans-serif"],
			},
			colors: {
				dodger: {
					50: "#eef7ff",
					100: "#d9ecff",
					200: "#bcdfff",
					300: "#8eccff",
					400: "#58afff",
					500: "#328dff",
					600: "#2372f5",
					700: "#1457e1",
					800: "#1746b6",
					900: "#193e8f",
					950: "#142757",
				},
				primary: {
					50: "#eff3ff",
					100: "#dbe4fe",
					200: "#bfd0fe",
					300: "#93affd",
					400: "#6088fa",
					500: "#3b6cf6",
					600: "#2559eb",
					700: "#1d4ed8",
					800: "#1e44af",
					900: "#1e3a8a",
					950: "#172754",
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				chart: {
					1: "hsl(var(--chart-1))",
					2: "hsl(var(--chart-2))",
					3: "hsl(var(--chart-3))",
					4: "hsl(var(--chart-4))",
					5: "hsl(var(--chart-5))",
				},
			},
			fontSize: {
				bb: "0.925rem",
				md: "0.975rem",
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
};
