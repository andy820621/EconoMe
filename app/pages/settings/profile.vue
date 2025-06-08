<template>
	<UForm :state="state" :schema="schema" @submit="saveProfile">
		<UFormField
			class="mb-4"
			label="Display Name"
			name="displayName"
			help="This name will be shown in your profile. Leave empty to use your OAuth provider name or email as fallback."
		>
			<UInput v-model="state.displayName" :placeholder="getNamePlaceholder()" />
		</UFormField>

		<UFormField
			class="mb-4"
			label="Email"
			name="email"
			help="You will receive a confirmation email on both the old and new addresses if you modify the email addresses."
		>
			<UInput v-model="state.email" />
		</UFormField>

		<UButton
			type="submit"
			variant="solid"
			color="neutral"
			label="Save"
			:loading="pending"
			:disabled="pending"
		/>
	</UForm>
</template>

<script setup lang="ts">
import { z } from "zod";

useHead({
	title: "Profile",
});

const supabase = useSupabaseClient<Database>();
const user = useSupabaseUser();

const { toastSuccess, toastError } = useAppToast();
const pending = ref(false);

// 獲取 OAuth 提供的名稱作為 placeholder
function getNamePlaceholder() {
	const oauthName =
		user.value?.user_metadata?.full_name || user.value?.user_metadata?.name;
	if (oauthName) {
		return `${oauthName}`;
	}
	const emailPrefix = user.value?.email?.split("@")[0];
	return emailPrefix ? `${emailPrefix}` : "Enter your display name";
}

const state = ref({
	displayName: user.value?.user_metadata?.custom_name || "",
	email: user.value?.email || "",
});

const schema = z.object({
	displayName: z.string().optional(),
	email: z.string().email(),
});

async function saveProfile() {
	pending.value = true;

	try {
		const data: any = {
			custom_name: state.value.displayName || null,
		};

		// 只有當 email 有變更時才包含 email
		if (state.value.email !== user.value?.email) {
			data.email = state.value.email;
		}

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
