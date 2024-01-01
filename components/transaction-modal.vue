<template>
	<UModal v-model="isOpen">
		<UCard
			:ui="{
				ring: '',
				divide: 'divide-y divide-gray-100 dark:divide-gray-800',
			}"
		>
			<template #header> Add Transaction </template>

			<UForm
				:schema="schema"
				:state="state"
				class="space-y-4"
				@submit="onSubmit"
				ref="form"
			>
				<UFormGroup required label="Transaction Type" name="type" class="mb-4">
					<USelect
						placeholder="Select a transaction Type"
						v-model="state.type"
						:options="transactionTypes"
					/>
				</UFormGroup>

				<UFormGroup label="Amount" required name="amount" class="mb-4">
					<UInput
						type="number"
						placeholder="Amount"
						v-model.number="state.amount"
					/>
				</UFormGroup>

				<UFormGroup
					label="Transaction date"
					required
					name="created_at"
					class="mb-4"
				>
					<UInput
						type="date"
						icon="i-heroicons-calendar-days-20-solid"
						v-model="state.created_at"
					/>
				</UFormGroup>

				<UFormGroup
					label="Description"
					hint="Optional"
					name="description"
					class="mb-4"
				>
					<UInput placeholder="Descriotion" v-model="state.description" />
				</UFormGroup>

				<UFormGroup
					label="Category"
					required
					name="category"
					class="mb-4"
					v-if="state.type === 'Expense'"
				>
					<USelect
						placeholder="Select a category"
						v-model="state.category"
						:options="categories"
						clearable
					/>
				</UFormGroup>

				<UButton
					type="submit"
					color="black"
					variant="solid"
					label="Save"
					:loading="isLoading"
				/>
			</UForm>
		</UCard>
	</UModal>
</template>

<script setup lang="ts">
import { categories, transactionTypes } from "@/constants";
import type { Database, Transaction } from "~/lib/database.types";
import type { FormError, FormSubmitEvent } from "#ui/types";
import { z } from "zod";

const props = defineProps<{
	isOpen: boolean;
}>();
const emit = defineEmits(["update:isOpen", "submitted"]);

const isOpen = computed({
	get: () => props.isOpen,
	set(value) {
		if (!value) resetForm();
		emit("update:isOpen", value);
	},
});

// Form Part
const isLoading = ref(false);
const form = ref();
const currentDate = new Date();
const defautSchema = z.object({
	amount: z.number().positive("Amount needs to be more than 0"),
	created_at: z.string(),
	description: z.string().optional(),
});
const incomeSchema = z.object({ type: z.literal("Income") });
const expenseSchema = z.object({
	type: z.literal("Expense"),
	category: z.enum(categories as [string, ...string[]]),
});
const investmentSchema = z.object({ type: z.literal("Investment") });
const sacingSchema = z.object({ type: z.literal("Savings") });
const schema = z.intersection(
	defautSchema,
	z.discriminatedUnion("type", [
		incomeSchema,
		expenseSchema,
		investmentSchema,
		sacingSchema,
	])
);
type Schema = z.output<typeof schema>;

const initialState = {
	type: undefined,
	amount: 0,
	created_at: undefined,
	description: undefined,
	category: undefined,
};
const state = reactive({
	...initialState,
	created_at:
		currentDate.getFullYear() +
		"-" +
		(currentDate.getMonth() + 1) +
		"-" +
		currentDate.getDate(),
});
const supabase = useSupabaseClient<Database>();
const toast = useToast();
async function onSubmit(event: FormSubmitEvent<Schema>) {
	console.log("onSubmit", event.data);
	if (form.value.errors.length) return;

	isLoading.value = true;

	try {
		const { error } = await supabase.from("transactions").upsert({ ...state });

		if (!error) {
			toast.add({
				title: "Transaction added",
				icon: "i-heroicons-check-circle",
			});
			isOpen.value = false;
			emit("submitted");
			return;
		}
		throw error;
	} catch (e) {
		toast.add({
			title: "Transaction not submitted",
			description: (e as Error).message,
			icon: "i-heroicons-exclamation-circle",
			color: "red",
		});
	} finally {
		isLoading.value = false;
	}
}

function resetForm() {
	Object.assign(state, initialState);
	form.value.clear();
}
</script>

<style scoped></style>
