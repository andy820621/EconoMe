export const useRedirectIfAuthenticated = (url = "/") => {
	const user = useSupabaseUser();

	watch(
		user,
		(userData) => {
			if (userData) return navigateTo(url);
		},
		{ immediate: true }
	);

	return {
		user,
	};
};
