<template>
	<div
		class="grid grid-cols-3 py-4 border-b border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-200"
	>
		<div class="flex items-center justify-between space-x-4 col-span-2">
			<div class="flex items-center space-x-1">
				<UIcon :name="icon" :class="[iconColor]" />
				<div>{{ transaction.description }}</div>
			</div>

			<div>
				<UBadge color="white" v-if="transaction.category">{{
					transaction.category
				}}</UBadge>
			</div>
		</div>

		<div class="flex items-center justify-end space-x-2">
			<div>{{ currency }}</div>
			<div>
				<UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
					<UButton
						color="white"
						variant="ghost"
						label="Options"
						trailing-icon="i-heroicons-ellipsis-horizontal"
						:loading="isLoading"
					/>
					<TransactionModal
						v-model:isOpen="isOpen"
						:transaction="transaction"
						@submitted="emit('editTransaction', 'edited')"
					/>
				</UDropdown>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
const props = defineProps<{
	transaction: Transaction;
}>();
const emit = defineEmits(["deleteTransaction", "editTransaction"]);

const isIncome = computed(() => props.transaction.type === "Income");
const icon = computed(() =>
	isIncome.value ? "i-heroicons-arrow-up-right" : "i-heroicons-arrow-down-left"
);
const iconColor = computed(() =>
	isIncome.value ? "text-green-600" : "text-red-600"
);

const { currency } = useCurrency(props.transaction.amount);

const items = [
	[
		{
			label: "Edit",
			icon: "i-heroicons-pencil-square-20-solid",
			click: () => (isOpen.value = true),
		},
		{
			label: "Delete",
			icon: "i-heroicons-trash-20-solid",
			click: deletTransaction,
		},
	],
];

// delete button method
const isLoading = ref(false);
const { toastSuccess, toastError } = useAppToast();
const supabase = useSupabaseClient();
async function deletTransaction() {
	isLoading.value = true;
	try {
		await supabase.from("transactions").delete().eq("id", props.transaction.id);

		toastSuccess({
			title: "Transaction deleted",
		});
		emit("deleteTransaction", props.transaction.id);
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
