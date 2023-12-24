<template>
	<section class="flex items-center justify-between mb-8">
		<h1 class="text-4xl font-extrabold">Summary</h1>
		<div>
			<USelectMenu v-model="selectedView" :options="transactionViewOptions" />
		</div>
	</section>

	<section
		class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16 mb-10"
	>
		<Trend
			color="green"
			title="Income"
			:amount="incomeTotal"
			:last-amount="3000"
			:loading="isLoading"
		/>
		<Trend
			color="red"
			title="Expense"
			:amount="expenseTotal"
			:last-amount="5000"
			:loading="isLoading"
		/>
		<Trend
			color="green"
			title="Incestments"
			:amount="4000"
			:last-amount="3000"
			:loading="isLoading"
		/>
		<Trend
			color="red"
			title="Saving"
			:amount="4000"
			:last-amount="4100"
			:loading="isLoading"
		/>
	</section>

	<section class="flex justify-between mb-10">
		<div>
			<h2 class="text-2xl font-extrabold">Transactions</h2>
			<div class="text-gray-500 dark:text-gray-400">
				You have {{ incomeCount }} incomes and {{ expenseCount }} expenses this
				period.
			</div>
		</div>
		<div>
			<TransactionModal v-model:is-open="isOpen" />
			<UButton
				icon="i-heroicons-plus-circle"
				color="white"
				variant="solid"
				label="Add"
				@click="isOpen = true"
			/>
		</div>
	</section>

	<section v-if="!isLoading">
		<div
			v-for="(transactionsOnDay, date) in transactionsGroupByDate"
			:key="date"
			class="mb-10"
		>
			<DailyTransactionSummary :date="date" :transactions="transactionsOnDay" />
			<Transaction
				v-for="transaction in transactionsOnDay"
				:key="transaction.id"
				:transaction="transaction"
				@deleteTransaction="refreshTransactions"
			/>
		</div>
	</section>
	<section v-else>
		<USkeleton class="h-8 w-full mb-2" v-for="i in 4" :key="i" />
	</section>
</template>

<script setup lang="ts">
import { transactionViewOptions } from "~/constants";

import type { Database } from "~/lib/database.types";

type Transaction = Database["public"]["Tables"]["transactions"]["Row"];

const selectedView = ref(transactionViewOptions[1]);

// init supabase client
const supabase = useSupabaseClient<Database>();
const transactions = ref<Transaction[]>([]);

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
const isLoading = ref(false);
async function fetchTransactions() {
	isLoading.value = true;
	try {
		const { data } = await useAsyncData("transactions", async () => {
			const { data, error } = await supabase.from("transactions").select();

			if (error) return [];
			return data;
		});

		return data.value;
	} catch (error) {
	} finally {
		isLoading.value = false;
	}
}

async function refreshTransactions() {
	const transactionsResult = await fetchTransactions();
	if (transactionsResult) transactions.value = transactionsResult;
}

await refreshTransactions();

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
	income.value.reduce((sum, transaction) => sum + (transaction.amount || 0), 0)
);
const expenseTotal = computed(() =>
	expense.value.reduce((sum, transaction) => sum + (transaction.amount || 0), 0)
);

// Modal for add transaction
const isOpen = ref(false);
</script>

<style scoped></style>
