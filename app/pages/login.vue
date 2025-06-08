<template>
	<UCard v-if="!success">
		<template #header> Sign-in to Finance Tracker </template>

		<!-- Social Login Section -->
		<div class="mb-8">
			<div class="mb-4">
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
					Quick Sign-in
				</h3>
				<p class="text-sm text-gray-600 dark:text-gray-400">
					Sign in with your social account in one click
				</p>
			</div>

			<div class="flex gap-3">
				<UButton
					variant="solid"
					color="neutral"
					@click="signInWithProvider('google')"
					:loading="socialLoading === 'google'"
					:disabled="pending || !!socialLoading"
					size="lg"
					class="inline-flex items-center justify-center gap-2 px-16"
				>
					<template #leading>
						<Icon name="logos:google-icon" />
					</template>
					Google
				</UButton>

				<UButton
					variant="solid"
					color="neutral"
					@click="signInWithProvider('github')"
					:loading="socialLoading === 'github'"
					:disabled="pending || !!socialLoading"
					size="lg"
					class="inline-flex items-center justify-center gap-2 px-16"
				>
					<template #leading>
						<Icon name="logos:github-icon" />
					</template>
					GitHub
				</UButton>
			</div>
		</div>

		<!-- Custom Divider -->
		<div class="relative my-8">
			<div class="absolute inset-0 flex items-center">
				<div class="w-full border-t border-gray-300 dark:border-gray-600"></div>
			</div>
			<div class="relative flex justify-center text-sm">
				<span
					class="px-4 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 font-medium"
				>
					Or
				</span>
			</div>
		</div>

		<!-- Email Magic Link Section -->
		<div>
			<div class="mb-4">
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
					Email Sign-in
				</h3>
				<p class="text-sm text-gray-600 dark:text-gray-400">
					We'll send a secure login link to your email
				</p>
			</div>

			<form @submit.prevent="handleLogin">
				<UFormField
					label="Email"
					name="email"
					class="mb-4"
					required
					help="You will receive an email with the confirmation link"
				>
					<UInput
						v-model="email"
						type="email"
						placeholder="Enter your email address"
						required
						size="lg"
						class="w-1/2"
					/>
				</UFormField>

				<div class="flex justify-flex-start">
					<UButton
						type="submit"
						variant="solid"
						color="neutral"
						label="Send Login Link"
						:loading="pending"
						:disabled="pending || !!socialLoading"
						size="lg"
						class="px-16"
					/>
				</div>
			</form>
		</div>
	</UCard>

	<UCard v-else>
		<template #header> Email has been sent </template>

		<div class="text-center">
			<p class="mb-4">
				We have sent an email to <strong>{{ email }}</strong> with a
				confirmation link to sign-in.
			</p>
			<p><strong>Important:</strong> The link will expire in 5 minutes.</p>
		</div>
	</UCard>
</template>

<script setup lang="ts">
useHead({
	title: "Login",
});

const success = ref(false);
const email = ref("");
const pending = ref(false);
const socialLoading = ref<string | null>(null);
const { toastError } = useAppToast();

const supabase = useSupabaseClient<Database>();
const redirectUrl = useRuntimeConfig().public.baseUrl;

// 確保 redirectTo URL 正確，避免雙斜線
const getRedirectUrl = (path: string) => {
	const baseUrl = redirectUrl.endsWith("/")
		? redirectUrl.slice(0, -1)
		: redirectUrl;
	return `${baseUrl}${path}`;
};

useRedirectIfAuthenticated();

// OAuth Social Login
async function signInWithProvider(provider: "google" | "github") {
	socialLoading.value = provider;

	try {
		const redirectTo = getRedirectUrl("/confirm");

		const { data, error } = await supabase.auth.signInWithOAuth({
			provider,
			options: {
				redirectTo,
				queryParams: {
					access_type: "offline",
					prompt: "consent",
				},
			},
		});

		if (error) {
			toastError({
				title: "Error authenticating",
				description: error.message,
			});
			socialLoading.value = null;
		} else {
			console.log("OAuth redirect initiated:", data);
			// OAuth 重導向會自動發生，保持 loading 狀態
		}
		// OAuth 重導向會自動發生，保持 loading 狀態
	} catch (error) {
		console.error("OAuth exception:", error);
		toastError({
			title: "Error authenticating",
			description: (error as Error).message,
		});
		socialLoading.value = null;
	}
}

// Magic Link Login (existing function)
async function handleLogin() {
	pending.value = true;

	try {
		const redirectTo = new URL("/confirm", redirectUrl).toString();

		const { data, error } = await supabase.auth.signInWithOtp({
			email: email.value,
			options: {
				emailRedirectTo: redirectTo,
			},
		});

		if (error) {
			toastError({
				title: "Error authenticating",
				description: error.message,
			});
		} else {
			success.value = true;
		}
	} finally {
		pending.value = false;
	}
}
</script>
