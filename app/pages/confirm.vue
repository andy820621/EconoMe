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
onMounted(async () => {
	try {
		const route = useRoute();

		// 如果是 OAuth 回調（有 code 參數），等待 Supabase 自動處理
		if (route.query.code) {
			// 等待較長時間讓 Supabase 中間件處理 OAuth 回調
			await new Promise((resolve) => setTimeout(resolve, 2000));
		}

		// 檢查 session 狀態（最多重試 3 次）
		let session = null;
		let attempts = 0;
		const maxAttempts = 3;

		while (!session && attempts < maxAttempts) {
			attempts++;

			const {
				data: { session: currentSession },
				error: sessionError,
			} = await supabase.auth.getSession();

			if (sessionError) {
				throw sessionError;
			}

			if (currentSession) {
				session = currentSession;
				break;
			}

			// 如果還沒有 session，等待一下再重試
			if (attempts < maxAttempts) {
				await new Promise((resolve) => setTimeout(resolve, 1500));
			}
		}

		if (session) {
			// 成功獲得 session
			status.value.loading = false;

			// 清理 URL 中的查詢參數
			if (route.query.code || route.query.state) {
				await navigateTo("/confirm", { replace: true });
				await new Promise((resolve) => setTimeout(resolve, 500));
			}

			// 重導向到首頁
			setTimeout(() => {
				navigateTo("/", { replace: true });
			}, 1000);
		} else {
			// 沒有有效的 session
			throw new Error("Authentication failed. No valid session was created.");
		}
	} catch (error: any) {
		status.value = {
			loading: false,
			title: "Sign in failed",
			error: true,
			message: error.message || "Authentication failed. Please try again.",
		};
	}
});

// 移除自動重導向，改為手動控制
// useRedirectIfAuthenticated();
</script>
