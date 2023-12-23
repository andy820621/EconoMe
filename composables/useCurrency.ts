export const useCurrency = (amount: number | Ref<number | null> | null) => {
	const formatCurrency = (value: number) =>
		new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(value);

	const currency = computed(() => {
		const value = isRef(amount) ? amount.value : amount;
		return value === null ? null : formatCurrency(value);
	});

	return {
		currency,
	};
};
