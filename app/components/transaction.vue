<template>
	<div
		class="grid grid-cols-3 py-4 border-b border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-200"
	>
		<div class="flex items-center justify-between space-x-4 col-span-2">
			<div class="flex items-center space-x-1">
				<UIcon :name="icon" :class="[iconColor]" />
				<div>{{ transaction.description }}</div>
			</div>

			<div>
				<UBadge color="neutral" variant="outline" v-if="transaction.category"
					>{{ transaction.category }}
				</UBadge>
			</div>
		</div>

		<div class="flex items-center justify-end space-x-2">
			<div>{{ currency }}</div>
			<div>
				<UDropdownMenu :items="items" :popper="{ placement: 'bottom-start' }">
					<!-- variant="ghost" -->
					<!-- label="Options" -->
					<UButton
						color="neutral"
						variant="outline"
						trailing-icon="i-heroicons-ellipsis-horizontal"
						:loading="isLoading"
					/>
					<TransactionModal
						v-model="isOpen"
						:transaction="transaction"
						@saved="emit('edited')"
					/>
				</UDropdownMenu>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";

const props = defineProps<{
	transaction: Transaction;
}>();
const emit = defineEmits(["deleted", "edited"]);

const isIncome = computed(() => props.transaction.type === "Income");
const icon = computed(() =>
	isIncome.value ? "i-heroicons-arrow-up-right" : "i-heroicons-arrow-down-left"
);
const iconColor = computed(() =>
	isIncome.value ? "text-green-600" : "text-red-600"
);
const amount = computed(() => props.transaction.amount);
const { currency } = useCurrency(amount);

const items: DropdownMenuItem[][] = [
	[
		{
			label: "Edit",
			icon: "i-heroicons-pencil-square-20-solid",
			onSelect: () => (isOpen.value = true),
		},
		{
			label: "Delete",
			icon: "i-heroicons-trash-20-solid",
			onSelect: deleteTransaction,
		},
	],
];

// delete button method
const isLoading = ref(false);
const { toastSuccess, toastError } = useAppToast();
const supabase = useSupabaseClient();
async function deleteTransaction() {
	console.log("deleteTransaction");

	isLoading.value = true;
	try {
		await supabase.from("transactions").delete().eq("id", props.transaction.id);

		toastSuccess({
			title: "Transaction deleted",
		});

		emit("deleted", props.transaction.id);
	} catch (error) {
		toastError({
			title: "Transaction was not deleted",
		});
	} finally {
		isLoading.value = false;
	}
}

// edit
const isOpen = ref(false);
</script>
