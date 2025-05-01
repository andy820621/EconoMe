<template>
	<UCard>
		<template #header>{{ status.title }}</template>
		<div v-if="status.loading">
			<p>Wait a moment while we sign you in...</p>
			<UProgress indeterminate />
		</div>
		<div v-else-if="status.error">
			<p>{{ status.message }}</p>
			<UButton to="/login" label="Return to login" class="mt-4" />
		</div>
	</UCard>
</template>

<script setup lang="ts">
useHead({
	title: "Confirm",
});

const supabase = useSupabaseClient<Database>();

const status = ref({
	loading: true,
	title: "Signing in...",
	error: false,
	message: "",
});

// 檢查 URL 參數，處理特殊情況如過期鏈接
onMounted(async () => {
	const { error } = await supabase.auth.getSession();
	if (error) {
		status.value = {
			loading: false,
			title: "Sign in failed",
			error: true,
			message:
				error.message || "Your login link may have expired. Please try again.",
		};
	}
});

useRedirectIfAuthenticated();
</script>
