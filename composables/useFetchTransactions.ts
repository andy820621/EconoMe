import type { Database, Transaction } from "~/lib/database.types";

export function useFetchTransactions() {
	const supabase = useSupabaseClient<Database>(); // init supabase client
	const transactions = ref<Transaction[]>([]);
	const pending = ref(false);
	// income / expense
	const income = computed(() =>
		transactions.value.filter((t) => t.type === "Income")
	);
	const expense = computed(() =>
		transactions.value.filter((t) => t.type === "Expense")
	);
	const incomeCount = computed(() => income.value.length);
	const expenseCount = computed(() => expense.value.length);
	const incomeTotal = computed(() =>
		income.value.reduce(
			(sum, transaction) => sum + (transaction.amount || 0),
			0
		)
	);
	const expenseTotal = computed(() =>
		expense.value.reduce(
			(sum, transaction) => sum + (transaction.amount || 0),
			0
		)
	);

	// group transactions by date
	const transactionsGroupByDate = computed(() => {
		const grouped: Record<string, Transaction[]> = {};
		for (const transaction of transactions.value) {
			const date = new Date(transaction.created_at).toISOString().split("T")[0];
			if (!grouped[date]) {
				grouped[date] = [];
			}
			grouped[date].push(transaction);
		}
		return grouped;
	});

	// get data from supabase and pass it as Transaction's props
	async function fetchTransactions() {
		pending.value = true;
		try {
			const { data } = await useAsyncData("transactions", async () => {
				const { data, error } = await supabase
					.from("transactions")
					.select()
					.order("created_at", { ascending: false });

				if (error) return [];
				return data;
			});

			return data.value;
		} catch (error) {
		} finally {
			pending.value = false;
		}
	}

	async function refresh() {
		const transactionsResult = await fetchTransactions();
		if (transactionsResult) transactions.value = transactionsResult;
	}

	return {
		transactions: {
			all: transactions,
			grouped: {
				byDate: transactionsGroupByDate,
			},
			income,
			expense,
			incomeCount,
			expenseCount,
			incomeTotal,
			expenseTotal,
		},
		pending,
		refresh,
	};
}