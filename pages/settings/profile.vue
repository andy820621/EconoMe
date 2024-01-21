<template>
	<UForm :state="state" :schema="schema" @submit="saveProfile">
		<UFormGroup class="mb-4" label="Full Name" name="name">
			<UInput v-model="state.name" />
		</UFormGroup>

		<UFormGroup
			class="mb-4"
			label="Email"
			name="email"
			help="You will receive a confirmation email on both the old and new addresses if you modify the email addresses."
		>
			<UInput v-model="state.email" />
		</UFormGroup>

		<UButton
			type="submit"
			variant="solid"
			color="black"
			label="Save"
			:loading="pending"
			:disabled="pending"
		/>
	</UForm>
</template>

<script setup lang="ts">
import { z } from "zod";

const supabase = useSupabaseClient<Database>();
const user = useSupabaseUser();

const { toastSuccess, toastError } = useAppToast();
const pending = ref(false);

const state = ref({
	name: user.value?.user_metadata?.full_name,
	email: user.value?.email,
});

const schema = z.object({
	name: z.string().min(2).optional(),
	email: z.string().email(),
});

async function saveProfile() {
	pending.value = true;

	try {
		const data = {
			full_name: state.value.name,
			email: state.value.email,
		};

		if (state.value.email === user.value?.email) delete data.email;

		const { error } = await supabase.auth.updateUser({ data });

		if (error) throw error;

		toastSuccess({
			title: "Profile updated",
			description: "Your profile has been updated",
		});
	} catch (error) {
		toastError({
			title: "Profile not updated",
			description: (error as Error).message,
		});
	} finally {
		pending.value = false;
	}
}
</script>

<style scoped></style>
