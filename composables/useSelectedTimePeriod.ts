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

export function useSelectedTimePeriod<T>(period: Ref<string>) {
	const current = computed(() => {
		switch (period.value) {
			case "Yearly":
				return {
					from: startOfYear(new Date()),
					to: new Date(),
				};
			case "Monthly":
				return {
					from: startOfMonth(new Date()),
					to: new Date(),
				};
			case "Weekly":
				return {
					from: startOfWeek(new Date()),
					to: new Date(),
				};
			default: // means Dialy
				return {
					from: startOfDay(new Date()),
					to: new Date(),
				};
		}
	});
	const previous = computed(() => {
		switch (period.value) {
			case "Yearly":
				return {
					from: startOfYear(sub(new Date(), { years: 1 })),
					to: endOfYear(sub(new Date(), { years: 1 })),
				};
			case "Monthly":
				return {
					from: startOfMonth(sub(new Date(), { months: 1 })),
					to: endOfMonth(sub(new Date(), { months: 1 })),
				};
			case "Weekly":
				return {
					from: startOfWeek(sub(new Date(), { weeks: 1 })),
					to: endOfWeek(sub(new Date(), { weeks: 1 })),
				};
			default: // means Dialy
				return {
					from: startOfDay(sub(new Date(), { days: 1 })),
					to: endOfDay(sub(new Date(), { days: 1 })),
				};
		}
	});
	return {
		current,
		previous,
	};
}
