// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2025-05-01",
	devtools: { enabled: true },
	modules: ["@nuxt/ui", "@nuxtjs/supabase"],
	supabase: {
		redirect: true,
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
