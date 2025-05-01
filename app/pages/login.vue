<template>
	<UCard v-if="!success">
		<template #header> Sign-in to Finance Tracker </template>

		<form @submit.prevent="handleLogin">
			<UFormField
				label="Email"
				name="email"
				class="mb-4"
				required
				help="You will receive an email with the confirmation link."
			>
				<UInput v-model="email" type="email" placeholder="Email" required />
			</UFormField>

			<UButton
				type="submit"
				variant="solid"
				color="neutral"
				label="Sign-in"
				:loading="pending"
				:disabled="pending"
			/>
		</form>
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
const { toastError } = useAppToast();

const supabase = useSupabaseClient<Database>();

const redirectUrl = useRuntimeConfig().public.baseUrl;

useRedirectIfAuthenticated();

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
