<script setup lang="ts">
import { transactionViewOptions } from "~/constants";

useHead({
	title: "Home",
});

const user = useSupabaseUser();

const selectedView = ref(
	user.value?.user_metadata?.transaction_view ?? transactionViewOptions[1]
);

const { current, previous } = useSelectedTimePeriod(selectedView);

const {
	pending,
	refresh,
	transactions: {
		incomeTotal,
		expenseTotal,
		incomeCount,
		expenseCount,
		investmentCount,
		investmentTotal,
		savingCount,
		savingTotal,
		grouped: { byDate },
	},
} = useFetchTransactions(current);

const {
	refresh: refreshPrevious,
	transactions: {
		incomeTotal: previousIncomeTotal,
		expenseTotal: previousExpenseTotal,
		investmentTotal: previousInvestmentTotal,
		savingTotal: previousSavingTotal,
	},
} = useFetchTransactions(previous);

await Promise.all([refresh(), refreshPrevious()]);

// Modal for add transaction
const isOpen = ref(false);
</script>

<template>
	<section class="flex items-center justify-between mb-10">
		<h1 class="text-4xl font-extrabold">Summary</h1>
		<div>
			<USelectMenu v-model="selectedView" :items="transactionViewOptions" />
		</div>
	</section>

	<section
		class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16 mb-10"
	>
		<Trend
			color="green"
			title="Income"
			:amount="incomeTotal"
			:last-amount="previousIncomeTotal"
			:loading="pending"
		/>
		<Trend
			color="red"
			title="Expense"
			:amount="expenseTotal"
			:last-amount="previousExpenseTotal"
			:loading="pending"
		/>
		<Trend
			color="green"
			title="Investments"
			:amount="investmentTotal"
			:last-amount="previousInvestmentTotal"
			:loading="pending"
		/>
		<Trend
			color="red"
			title="Saving"
			:amount="savingTotal"
			:last-amount="previousSavingTotal"
			:loading="pending"
		/>
	</section>

	<section class="flex justify-between mb-10">
		<div>
			<h2 class="text-2xl font-extrabold">Transactions</h2>
			<div class="text-neutral-500 dark:text-neutral-400">
				You have {{ incomeCount }} incomes and {{ expenseCount }} expenses this
				period.
			</div>
		</div>
		<div>
			<TransactionModal v-model="isOpen" @saved="refresh" />

			<!-- variant="solid" -->
			<UButton
				icon="i-heroicons-plus-circle"
				color="neutral"
				variant="outline"
				label="Add"
				@click="isOpen = true"
			/>
		</div>
	</section>

	<section v-if="!pending">
		<div v-if="Object.keys(byDate).length === 0" class="text-center py-10">
			<p>No transactions for this period.</p>
		</div>

		<template v-else>
			<div
				v-for="(transactionsOnDay, date) in byDate"
				:key="date"
				class="mb-10"
			>
				<DailyTransactionSummary
					:date="date"
					:transactions="transactionsOnDay"
				/>
				<Transaction
					v-for="transaction in transactionsOnDay"
					:key="transaction.id"
					:transaction="transaction"
					@deleted="refresh"
					@edited="refresh"
				/>
			</div>
		</template>
	</section>
	<section v-else>
		<USkeleton class="h-8 w-full mb-2" v-for="i in 4" :key="i" />
	</section>
</template>
