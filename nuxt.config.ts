// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2025-05-01",
	devtools: { enabled: true },
	modules: ["@nuxt/ui", "@nuxtjs/supabase"],
	ssr: true,
	supabase: {
		redirect: true,
		redirectOptions: {
			login: "/login",
			callback: "/confirm",
			exclude: ["/"],
		},
		cookieOptions: {
			maxAge: 60 * 60 * 8, // 8 hours
			sameSite: "lax",
			secure: process.env.NODE_ENV === "production",
		},
	},
	// typescript: {
	// 	typeCheck: true,
	// },
	runtimeConfig: {
		public: {
			baseUrl: process.env.BASE_URL || "http://localhost:3000",
		},
	},
	future: {
		compatibilityVersion: 4,
	},
	css: ["~/assets/css/main.css"],
	ui: {
		// colors: {
		// 	primary: 'green',
		// 	neutral: 'slate'
		// },
		// button: {
		// }
	},
	// 減少 hydration 警告
	// experimental: {
	// 	payloadExtraction: false,
	// },
	// tailwindcss: {
	// 	config: {
	// 		darkMode: "class",
	// 		theme: {
	// 			extend: {
	// 				colors: {
	// 					green: {
	// 						400: "rgb(74 222 128)",
	// 						600: "rgb(22 163 74)",
	// 					},
	// 					red: {
	// 						400: "rgb(248 113 113)",
	// 						600: "rgb(220 38 38)",
	// 					},
	// 				},
	// 			},
	// 		},
	// 	},
	// },
	// postcss: {
	// 	plugins: {
	// 		"postcss-nested": {},
	// 		"postcss-custom-media": {},
	// 	},
	// },
});
