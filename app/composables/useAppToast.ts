export const useAppToast = () => {
	const toast = useToast();

	interface ToastParams {
		title: string;
		description?: string;
	}

	function toastSuccess({ title, description }: ToastParams) {
		toast.add({
			title,
			description,
			icon: "i-heroicons-check-circle",
			color: "success",
		});
	}

	function toastError({ title, description }: ToastParams) {
		toast.add({
			title,
			description,
			icon: "i-heroicons-exclamation-circle",
			color: "error",
		});
	}

	return {
		toastSuccess,
		toastError,
	};
};
