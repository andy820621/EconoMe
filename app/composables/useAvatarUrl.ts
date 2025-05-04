export function useAvatarUrl() {
	const supabase = useSupabaseClient<Database>();
	const user = useSupabaseUser();

	const url = ref();

	function getPublicUrl() {
		if (!user.value?.user_metadata.avatar_url) return undefined;

		const { data } = supabase.storage
			.from("avatars")
			.getPublicUrl(user.value.user_metadata.avatar_url);

		return data.publicUrl;
	}

	watch(user, () => (url.value = getPublicUrl()), { immediate: true });

	return { url };
}
