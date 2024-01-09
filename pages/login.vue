<template>
	<UCard v-if="!success">
		<template #header> Sign-in to Finance Tracker </template>

		<form>
			<UFormGroup
				label="Email"
				name="email"
				class="mb-4"
				required
				help="You will receive an email with the confirmation link."
			>
				<UInput type="email" placeholder="Email" required />
			</UFormGroup>

			<UButton
				type="submit"
				variant="solid"
				color="black"
				label="Sign-in"
				@click="success = true"
			/>
		</form>
	</UCard>

	<UCard v-else>
		<template #header> Email has been sent </template>

		<div class="text-center">
			<p class="mb-4">
				We have sent an email to <strong>rmsil@gmail.com</strong> with a
				confirmation link to sign-in.
			</p>
			<p><strong>Important:</strong> The link will expire in 5 minutes.</p>
		</div>
	</UCard>
</template>

<script setup lang="ts">
const success = ref(false);
</script>

<style scoped></style>
