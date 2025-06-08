export function useAvatarUrl() {
	const supabase = useSupabaseClient<Database>();
	const user = useSupabaseUser();

	const url = ref();

	function getAvatarUrl() {
		if (!user.value?.user_metadata) return getDefaultAvatar();

		const metadata = user.value.user_metadata;

		// 優先級 1: 用戶上傳的自定義頭像
		if (metadata.custom_avatar_url) {
			const { data } = supabase.storage
				.from("avatars")
				.getPublicUrl(metadata.custom_avatar_url);
			return data.publicUrl;
		}

		// 優先級 2: OAuth 提供者的頭像
		if (
			metadata.avatar_url &&
			(metadata.avatar_url.startsWith("http://") ||
				metadata.avatar_url.startsWith("https://"))
		) {
			return metadata.avatar_url;
		}

		// 優先級 3: 預設頭像
		return getDefaultAvatar();
	}

	function getDefaultAvatar() {
		const userName =
			user.value?.user_metadata?.full_name ||
			user.value?.email?.split("@")[0] ||
			"User";
		return `https://ui-avatars.com/api/?name=${encodeURIComponent(
			userName
		)}&background=random&color=fff`;
	}

	watch(user, () => (url.value = getAvatarUrl()), { immediate: true });

	return { url };
}
