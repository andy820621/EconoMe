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

const trendingUp = computed(() => {
	if (!import.meta.client && props.loading) return true; // SSR 時如果還在加載，返回默認值
	return props.amount >= props.lastAmount;
});

const icon = computed(() => {
	if (!import.meta.client && props.loading)
		return "i-heroicons-arrow-trending-up"; // SSR 時如果還在加載，返回默認 icon
	return trendingUp.value
		? "i-heroicons-arrow-trending-up"
		: "i-heroicons-arrow-trending-down";
});

const { currency } = useCurrency(amount);

const percentageTrend = computed(() => {
	if (!import.meta.client && props.loading) return "0%"; // SSR 時如果還在加載，返回默認值

	if (props.amount === 0 && props.lastAmount === 0) return "0%";
	if (props.lastAmount === 0) return "∞%";
	if (props.amount === 0) return "-100%";

	const bigger = Math.max(props.amount, props.lastAmount);
	const lower = Math.min(props.amount, props.lastAmount);

	const ratio = ((bigger - lower) / lower) * 100;

	return Math.ceil(ratio) + "%";
});
</script>
