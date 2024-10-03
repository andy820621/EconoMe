// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },
	modules: ["@nuxt/ui", "@nuxtjs/supabase"],
	// TODO: Missing supabase url, supabase anon key
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
});
