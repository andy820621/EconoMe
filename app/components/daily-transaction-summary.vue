<template>
	<div
		class="grid grid-cols-2 py-4 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 font-bold"
	>
		<div class="flex items-center justify-between">
			{{ date }}
		</div>

		<div class="flex items-center justify-end mr-10">{{ currency }}</div>
	</div>
</template>

<script setup lang="ts">
const props = defineProps<{
	transactions: Transaction[];
	date: string;
}>();

const sum = computed(() => {
	let sum = 0;

	for (const transaction of props.transactions) {
		if (transaction.type === "Income" && transaction.amount != null) {
			sum += transaction.amount;
		} else if (transaction.amount != null) {
			sum -= transaction.amount;
		}
	}

	return sum;
});

const { currency } = useCurrency(sum);
</script>
