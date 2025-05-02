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
	const isMounted = ref(false);

	onMounted(() => (isMounted.value = true));

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

	// 初始載入時使用 useAsyncData
	async function initialFetch() {
		pending.value = true;
		try {
			const cacheKey = `transactions-${period.value.from.toDateString()}-${period.value.to.toDateString()}`;
			const { data } = await useAsyncData(cacheKey, fetchTransactionsData);
			return data.value;
		} catch (error) {
			console.error("獲取資料時出錯:", error);
			return [];
		} finally {
			pending.value = false;
		}
	}

	// 更新時使用 $fetch 風格
	async function updateFetch() {
		pending.value = true;
		try {
			return await fetchTransactionsData();
		} catch (error) {
			console.error("獲取資料時出錯:", error);
			return [];
		} finally {
			pending.value = false;
		}
	}

	async function refresh() {
		const result = isMounted.value ? await updateFetch() : await initialFetch();
		if (result) transactions.value = result;
	}

	watch(period, async () => await refresh());

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
