<template>
	<UModal
		v-model:open="isOpen"
		:title="(isEditing ? 'Edit' : 'Add') + ' Transaction'"
	>
		<template #body>
			<UForm :state="state" :schema="schema" ref="form" @submit="save">
				<UFormField required label="Transaction Type" name="type" class="mb-4">
					<USelect
						:disabled="isEditing"
						placeholder="Select the transaction type"
						v-model="state.type"
						:items="transactionTypes"
					/>
				</UFormField>

				<UFormField label="Amount" required name="amount" class="mb-4">
					<UInput
						type="number"
						placeholder="Amount"
						v-model.number="state.amount"
					/>
				</UFormField>

				<UFormField
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
				</UFormField>

				<UFormField
					label="Description"
					hint="Optional"
					name="description"
					class="mb-4"
				>
					<UInput placeholder="Description" v-model="state.description" />
				</UFormField>

				<UFormField
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
				</UFormField>
			</UForm>
		</template>

		<template #footer>
			<div class="flex justify-end">
				<UButton
					type="submit"
					color="neutral"
					variant="solid"
					label="Save"
					:loading="isLoading"
					@click="form?.submit()"
				/>
			</div>
		</template>
	</UModal>
</template>

<script setup lang="ts">
import { categories, transactionTypes } from "~/constants";
import type { Database } from "~/lib/database.types";
import { z } from "zod";
import { format } from "date-fns";

const props = defineProps<{
	modelValue: boolean;
	transaction?: Transaction;
}>();
const isEditing = computed(() => !!props.transaction);
const emit = defineEmits(["update:modelValue", "saved"]);

const isOpen = computed({
	get: () => props.modelValue,
	set: (value) => {
		if (!value) resetForm();
		emit("update:modelValue", value);
	},
});

// Form Part
const isLoading = ref(false);
const form = ref();
const defaultSchema = z.object({
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
const savingSchema = z.object({ type: z.literal("Saving") });

const schema = z.intersection(
	defaultSchema,
	z.discriminatedUnion("type", [
		incomeSchema,
		expenseSchema,
		investmentSchema,
		savingSchema,
	])
);
type Schema = z.output<typeof schema>;

const initialState = isEditing.value
	? {
			type: props.transaction?.type as Schema["type"],
			amount: props.transaction?.amount as Schema["amount"],
			created_at: props.transaction?.created_at.split(
				"T"
			)[0] as Schema["created_at"],
			description: props.transaction?.description as Schema["description"],
			category: props.transaction?.category || undefined,
	  }
	: {
			type: undefined,
			amount: 0,
			created_at: format(new Date(), "yyyy-MM-dd"),
			description: undefined,
			category: undefined,
	  };
const state = ref({ ...initialState });

const supabase = useSupabaseClient<Database>();
const { toastSuccess, toastError } = useAppToast();

async function save() {
	if (form.value.errors.length) return;

	isLoading.value = true;

	try {
		const { error } = await supabase
			.from("transactions")
			.upsert(
				isEditing.value
					? { ...state.value, id: props.transaction?.id }
					: { ...state.value }
			);

		if (!error) {
			toastSuccess({
				title: "Transaction saved",
			});
			isOpen.value = false;
			emit("saved");
			return;
		}

		throw error;
	} catch (e) {
		if (e instanceof Error) {
			toastError({
				title: "Transaction not saved",
				description: e.message,
			});
		} else {
			toastError({
				title: "Transaction not saved",
				description: "發生未知錯誤",
			});
		}
	} finally {
		isLoading.value = false;
	}
}

const resetForm = () => {
	Object.assign(state.value, initialState);
	form.value.clear();
};
</script>
