import type { NuxtLink } from '#build/components';
<template>
	<header class="flex justify-between items-center mt-5">
		<NuxtLink to="/" class="text-xl font-bold">Finance Tracker</NuxtLink>
		<div>
			<UAvatar
				src="https://avatars.githubusercontent.com/u/739984?v=4"
				alt="Avatar"
			/>
		</div>
	</header>
</template>

<script setup lang="ts">
const user = useSupabaseUser();

watch(
	user,
	(user) => {
		if (user) console.log("Signed in!", user);
	},
	{ immediate: true }
);
</script>

<style scoped></style>
