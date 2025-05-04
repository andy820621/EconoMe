export const transactionViewOptions: [string, ...string[]] = [
	"Yearly",
	"Monthly",
	"Weekly",
	"Daily",
] as const;

export const categories = ["Food", "Housing", "Car", "Entertainment", "Other"];

export const transactionTypes = [
	"Income",
	"Expense",
	"Saving",
	"Investment",
] as const;
