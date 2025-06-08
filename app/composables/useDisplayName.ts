export function useDisplayName() {
	const user = useSupabaseUser();

	const displayName = computed(() => {
		if (!user.value) return "";

		const metadata = user.value.user_metadata;

		// 優先級 1: 用戶自定義設定的名字 (從 profile 設定)
		if (metadata?.custom_name) {
			return metadata.custom_name;
		}

		// 優先級 2: OAuth 提供者的名字
		if (metadata?.full_name) {
			return metadata.full_name;
		}

		// 優先級 3: OAuth 提供者的用戶名
		if (metadata?.name) {
			return metadata.name;
		}

		// 優先級 4: 從 email 提取的用戶名 (@ 前面的部分)
		if (user.value.email) {
			return user.value.email.split("@")[0];
		}

		// 最後備用
		return "User";
	});

	return {
		displayName,
	};
}
