<template>
	<div class="container mx-auto max-w-4xl px-4 sm:px-6 md:px-4 lg:px-0">
		<AppHeader />

		<main class="my-10">
			<slot />
		</main>
	</div>
</template>

<script setup>
useHead({
	titleTemplate: "%s - EconoMe",
	// Link to Google Fonts
	link: [
		{
			rel: "preconnect",
			href: "https://fonts.googleapis.com",
		},
		{
			rel: "stylesheet",
			href: "https://fonts.googleapis.com/css2?family=Inter&display=swap",
			crossorigin: "",
		},
	],
});
</script>
