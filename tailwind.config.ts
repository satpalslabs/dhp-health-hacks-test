import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			fontFamily: {
				poppins: "var(--font-poppins)",
				mulish: "var(--font-mulish)",
				inter: "var(--font-inter)"
			},
			backgroundImage: {
				'gradient-mobile-button': 'var(--mobile-gradient-button)',

			},
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				input: {
					border: "hsl(var(--input-border))",
					default: "hsl(var(--input))"
				},
				button: {
					filter: {
						background: "hsl(var(--filter-button))",
						text: "hsl(var(--filter-button-text))",
					},
					status: {
						darkGray: "hsl(var(--bg-dark-gray))", // Background color with opacity support
						inReviewButton: "rgba(var(--in-review-button))",
						rejectedButton: "rgba(var(--rejected-button))",
						publishedButton: "rgba(var(--published-button))"
					}

				},
				mobile: {
					dark: {
						background: "hsl(var(--mobile-dark-view))",
						article: "hsl(var(--mobile-article-dark-background))",
						card: "rgba(var(--mobile-card-dark-view))"
					},
					cardShadow: {
						shadow: "var(--mobile-card-shadow)"
					},
					text: {
						heading: "hsl(var(--mobile-text))",
						firstSection: "hsl(var(--mobile-first-section))",
						primary: "hsl(var(--mobile-primary-text))",
						"main-text-color": "rgba(--main-text-color))"
					},
					gray: "rgba(var(--mobile-gray))",
					primary: "hsl(var(--mobile-primary))",
					layout: "hsl(var(--mobile-layout))"
				},
				text: {
					foreground: 'hsl(var(--text-foreground))',
					darkGray: "hsl(var(--dark-gray))", // Background color with opacity support
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
					light: '#E2E8F0'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				onboarding: {
					card: {
						button: "hsl(var(--onboarding-card-buttons))"
					}
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				tabs: {
					activeTab: 'hsl(var(--active-tab-background))'
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			boxShadow: {
				unit: "0px -3.36px 0px 0px #00000040 inset"

			}
		}
	},

	plugins: [require("tailwindcss-animate")],
} satisfies Config;
