import {
	endOfDay,
	endOfMonth,
	endOfWeek,
	endOfYear,
	startOfDay,
	startOfMonth,
	startOfWeek,
	startOfYear,
	sub,
} from "date-fns";

export function useSelectedTimePeriod(period: Ref<string>) {
	const baseDate = ref(new Date());

	onMounted(() => {
		baseDate.value = new Date();
	});

	const current = computed(() => {
		const now = baseDate.value;

		switch (period.value) {
			case "Yearly":
				return {
					from: startOfYear(now),
					to: endOfYear(now),
				};
			case "Monthly":
				return {
					from: startOfMonth(now),
					to: endOfMonth(now),
				};
			case "Weekly":
				return {
					from: startOfWeek(now),
					to: endOfWeek(now),
				};
			default: // means Dialy
				return {
					from: startOfDay(now),
					to: endOfDay(now),
				};
		}
	});

	const previous = computed(() => {
		const now = baseDate.value;
		switch (period.value) {
			case "Yearly":
				return {
					from: startOfYear(sub(now, { years: 1 })),
					to: endOfYear(sub(now, { years: 1 })),
				};
			case "Monthly":
				return {
					from: startOfMonth(sub(now, { months: 1 })),
					to: endOfMonth(sub(now, { months: 1 })),
				};
			case "Weekly":
				return {
					from: startOfWeek(sub(now, { weeks: 1 })),
					to: endOfWeek(sub(now, { weeks: 1 })),
				};
			default: // means Dialy
				return {
					from: startOfDay(sub(now, { days: 1 })),
					to: endOfDay(sub(now, { days: 1 })),
				};
		}
	});
	return {
		current,
		previous,
	};
}
