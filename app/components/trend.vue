<template>
	<div>
		<div class="font-bold" :class="[color]">{{ title }}</div>

		<div class="text-2xl font-extrabold text-black dark:text-white mb-2">
			<USkeleton class="h-8 w-[30%]" v-if="loading" />
			<div v-else>{{ currency }}</div>
		</div>

		<div>
			<USkeleton class="h-6 w-[81%]" v-if="loading" />
			<div v-else class="flex space-x-1 items-center text-sm">
				<UIcon
					:name="icon"
					class="w-6 h-6"
					:class="trendingUp ? 'text-success' : 'text-error'"
				/>
				<div class="text-neutral-500 dark:text-neutral-400">
					{{ percentageTrend }} vs last period
				</div>
			</div>
		</div>
	</div>
</template>
∞∞
<script setup lang="ts">
const props = defineProps<{
	title: string;
	amount: number;
	lastAmount: number;
	color: string;
	loading: boolean;
}>();

const { amount } = toRefs(props);

const trendingUp = computed(() => props.amount >= props.lastAmount);
const icon = computed(() =>
	trendingUp.value
		? "i-heroicons-arrow-trending-up"
		: "i-heroicons-arrow-trending-down"
);

const { currency } = useCurrency(amount);

const percentageTrend = computed(() => {
	if (props.amount === 0 || props.lastAmount === 0) return "∞%";

	const bigger = Math.max(props.amount, props.lastAmount);
	const lower = Math.min(props.amount, props.lastAmount);

	const ratio = ((bigger - lower) / lower) * 100;

	return Math.ceil(ratio) + "%";
});
</script>
