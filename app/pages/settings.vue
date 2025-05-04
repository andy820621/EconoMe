<template>
	<div class="grid grid-cols-6 gap-8">
		<UNavigationMenu
			orientation="vertical"
			:items="links"
			class="col-span-2"
		></UNavigationMenu>
		<div class="col-span-4">
			<NuxtPage />
		</div>
	</div>
</template>

<script setup lang="ts">
useHead({
	title: "Settings",
});

definePageMeta({
	redirect: "/settings/profile",
});

const links = [
	{
		label: "Profile",
		to: "/settings/profile",
	},
	{
		label: "Avatar",
		to: "/settings/avatar",
	},
	{
		label: "Preferences",
		to: "/settings/preferences",
	},
];
</script>
