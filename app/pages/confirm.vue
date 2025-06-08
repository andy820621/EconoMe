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
		<div v-else>
			<p>✅ Authentication successful! Redirecting...</p>
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

// 處理認證確認
onMounted(() => {
	// 監聽認證狀態變化
	const { data: authListener } = supabase.auth.onAuthStateChange(
		(event, session) => {
			console.log("Auth state changed:", event, session?.user?.email);

			if (event === "SIGNED_IN" && session) {
				// OAuth 認證成功
				status.value.loading = false;
				navigateTo("/", { replace: true });
			} else if (
				event === "SIGNED_OUT" ||
				(event === "TOKEN_REFRESHED" && !session)
			) {
				// 認證失敗
				status.value = {
					loading: false,
					title: "Sign in failed",
					error: true,
					message: "Authentication failed. Please try again.",
				};
			}
		}
	);

	// 檢查當前是否已有有效 session（處理直接訪問 /confirm 的情況）
	supabase.auth.getSession().then(({ data: { session }, error }) => {
		if (error) {
			console.error("Session check failed:", error);
			status.value = {
				loading: false,
				title: "Sign in failed",
				error: true,
				message: error.message,
			};
		} else if (session) {
			// 已經有有效 session，直接重導向
			status.value.loading = false;
			navigateTo("/", { replace: true });
		}
		// 如果沒有 session 且沒有錯誤，繼續等待 OAuth 回調
	});

	// 清理監聽器
	onUnmounted(() => {
		authListener.subscription.unsubscribe();
	});
});
</script>
