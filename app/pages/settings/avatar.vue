<template>
	<div>
		<div class="mb-4">
			<UFormField
				label="Current avatar"
				class="w-full"
				:help="avatarUrl ? undefined : 'This would be blank by default'"
			>
				<UAvatar :src="avatarUrl" size="3xl" imgClass="object-cover" />
			</UFormField>
		</div>

		<div class="mb-4">
			<UFormField
				label="New avatar"
				class="w-full"
				name="avatar"
				help="After choosing an image click Save to actually upload the new avatar"
			>
				<div class="flex items-center gap-4">
					<!-- 左側預覽區域 -->
					<div
						v-if="previewUrl"
						class="flex-shrink-0 w-fit h-fit flex items-center justify-center"
					>
						<UAvatar
							:src="previewUrl"
							size="lg"
							imgClass="object-cover w-full h-full"
						/>
					</div>

					<!-- 文件輸入 -->
					<div class="flex-grow">
						<UInput
							type="file"
							ref="fileInput"
							accept="image/jpeg, image/png, image/gif, image/webp"
							@change="handleFileChange"
						/>
					</div>
				</div>
			</UFormField>
		</div>

		<UButton
			type="submit"
			color="neutral"
			variant="solid"
			label="Save"
			:loading="uploading"
			:disabled="uploading"
			@click="saveAvatar"
		/>
	</div>
</template>

<script setup lang="ts">
useHead({
	title: "Avatar",
});

const supabase = useSupabaseClient<Database>();
const user = useSupabaseUser();
// We need to get the actual avatar URL
const { toastSuccess, toastError } = useAppToast();

const { url: avatarUrl } = useAvatarUrl();

const uploading = ref(false);
const fileInput = ref();
const previewUrl = ref();

function handleFileChange(event: Event) {
	const target = event.target as HTMLInputElement;

	if (target.files && target.files.length > 0) {
		const file = target.files[0];
		if (!file) {
			previewUrl.value = undefined;
			return;
		}
		const imageUrl = URL.createObjectURL(file);
		previewUrl.value = imageUrl ?? undefined;
	} else {
		previewUrl.value = undefined;
	}
}

async function saveAvatar() {
	const file = fileInput.value?.inputRef?.files[0];
	if (!file) {
		toastError({ title: "Select a file to upload avatar first!" });
		return;
	}

	if (file.size > 2 * 1024 * 1024) {
		toastError({ title: "File size should be less than 2MB" });
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
		const { error: updateError } = await supabase.auth.updateUser({
			data: {
				avatar_url: fileName,
			},
		});

		if (updateError) {
			toastError({
				title: "Error updating user metadata",
				description: updateError.message,
			});
			throw updateError;
		}

		// remove the old avatar file
		if (currentAvatarUrl) {
			const { error } = await supabase.storage
				.from("avatars")
				.remove([currentAvatarUrl]);
			if (error) throw error;
		}

		if (fileInput.value?.inputRef) fileInput.value.inputRef.value = null;

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
}
</script>
