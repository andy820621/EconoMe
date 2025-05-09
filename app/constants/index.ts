export const transactionViewOptions: [string, ...string[]] = [
	"Yearly",
	"Monthly",
	"Weekly",
	"Daily",
] as const;

export const categories: [string, ...string[]] = [
	"Food",
	"Housing",
	"Car",
	"Entertainment",
	"Other",
] as const;

export const transactionTypes: [string, ...string[]] = [
	"Income",
	"Expense",
	"Saving",
	"Investment",
] as const;
