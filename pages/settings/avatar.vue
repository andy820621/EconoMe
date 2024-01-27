<template>
	<div>
		<div class="mb-4">
			<UFormGroup
				label="Current avatar"
				class="w-full"
				help="This would be blank by default"
			>
				<UAvatar :src="avatarUrl" size="3xl" imgClass="object-cover" />
			</UFormGroup>
		</div>

		<div class="mb-4">
			<UFormGroup
				label="New avatar"
				class="w-full"
				name="avatar"
				help="After choosing an image click Save to actually upload the new avatar"
			>
				<UInput type="file" ref="fileInput" />
			</UFormGroup>
		</div>

		<UButton
			type="submit"
			color="black"
			variant="solid"
			label="Save"
			:loading="uploading"
			:disabled="uploading"
			@click="saveAvatar"
		/>
	</div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient<Database>();
const user = useSupabaseUser();
// We need to get the actual avatar URL
const { toastSuccess, toastError } = useAppToast();

const { url: avatarUrl } = useAvatarUrl();

const uploading = ref(false);
const fileInput = ref();

const saveAvatar = async () => {
	const file = fileInput.value.input.files[0];
	if (!file) {
		toastError({ title: "Select a file to upload avatar first!" });
		return;
	}

	const fileExtension = file.name.split(".").pop();
	const fileName = `${uuid()}.${fileExtension}`;

	try {
		uploading.value = true;
		// Grab the current avatar URL
		const currentAvatarUrl = user.value?.user_metadata?.avatar_url;

		// Upload the image to avatars bucket
		const { error } = await supabase.storage
			.from("avatars")
			.upload(fileName, file);
		if (error) throw error;

		// Update the user metadata with the avatar URL
		await supabase.auth.updateUser({
			data: {
				avatar_url: fileName,
			},
		});

		// remove the old avatar file
		if (currentAvatarUrl) {
			const { error } = await supabase.storage
				.from("avatars")
				.remove([currentAvatarUrl]);
			if (error) throw error;
		}

		fileInput.value.input.value = null; // Reset the file input

		toastSuccess({
			title: "Avatar uploaded",
		});
	} catch (error: any) {
		toastError({
			title: "Error uploading avatar",
			description: error.message,
		});
	} finally {
		uploading.value = false;
	}
};
</script>
