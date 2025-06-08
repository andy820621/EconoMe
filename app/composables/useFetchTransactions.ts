import { endOfDay, formatISO, startOfDay } from "date-fns";
import type { Database, Transaction } from "~/lib/database.types";

export function useFetchTransactions(
	period: ComputedRef<{
		from: Date;
		to: Date;
	}>
) {
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

	// investment / saving
	const investment = computed(() =>
		transactions.value.filter((t) => t.type === "Investment")
	);
	const saving = computed(() =>
		transactions.value.filter((t) => t.type === "Saving")
	);
	const investmentCount = computed(() => investment.value.length);
	const savingCount = computed(() => saving.value.length);
	const investmentTotal = computed(() =>
		investment.value.reduce(
			(sum, transaction) => sum + (transaction.amount || 0),
			0
		)
	);
	const savingTotal = computed(() =>
		saving.value.reduce(
			(sum, transaction) => sum + (transaction.amount || 0),
			0
		)
	);

	// group transactions by date
	const transactionsGroupByDate = computed(() => {
		const grouped: Record<string, Transaction[]> = {};
		for (const transaction of transactions.value) {
			const date = transaction.created_at.split("T")[0]!; // YYYY-MM-DD
			if (!grouped[date]) {
				grouped[date] = [];
			}
			grouped[date].push(transaction);
		}
		return grouped;
	});

	// 使用 $fetch 風格的請求
	async function fetchTransactionsData() {
		const startDate = startOfDay(period.value.from);
		const endDate = endOfDay(period.value.to);
		const formattedStartDate = formatISO(startDate);
		const formattedEndDate = formatISO(endDate);

		const { data, error } = await supabase
			.from("transactions")
			.select()
			.gte("created_at", formattedStartDate)
			.lte("created_at", formattedEndDate)
			.order("created_at", { ascending: false });

		if (error) {
			console.error("獲取資料錯誤:", error);
			return [];
		}

		return data || [];
	}

	// 統一使用 refresh 方法，避免 SSR/CSR 不一致
	async function refresh() {
		pending.value = true;
		try {
			const result = await fetchTransactionsData();
			transactions.value = result;
		} catch (error) {
			console.error("獲取資料時出錯:", error);
			transactions.value = [];
		} finally {
			pending.value = false;
		}
	}

	// 僅在客戶端且期間變更時觸發刷新
	watch(period, async () => {
		if (import.meta.client) await refresh();
	});

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
			investment,
			saving,
			investmentCount,
			savingCount,
			investmentTotal,
			savingTotal,
		},
		pending,
		refresh,
	};
}
