export const useCurrency = (
	amount: MaybeRef<number | null> = 0,
	locale: string = "en-US",
	currency: string = "USD"
) => {
	const formatCurrency = (value: number) =>
		new Intl.NumberFormat(locale, {
			style: "currency",
			currency,
		}).format(value);

	const currencyValue = computed(() => {
		const resolvedAmount = isRef(amount) ? amount.value : amount;
		return resolvedAmount === null ? null : formatCurrency(resolvedAmount);
	});

	return {
		currency: currencyValue,
	};
};
