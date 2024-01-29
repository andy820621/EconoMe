<template>
	<UModal v-model="isOpen" @update:model-value="handelUpdateIsOpen">
		<UCard
			:ui="{
				ring: '',
				divide: 'divide-y divide-gray-100 dark:divide-gray-800',
			}"
		>
			<template #header>
				{{ isEditing ? "Edit" : "Add" }} Transaction
			</template>

			<UForm
				:schema="schema"
				:state="state"
				class="space-y-4"
				@submit="onSubmit"
				ref="form"
			>
				<UFormGroup required label="Transaction Type" name="type" class="mb-4">
					<USelect
						:disabled="isEditing"
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
import type { Database } from "~/lib/database.types";
import type { FormSubmitEvent } from "#ui/types";
import { z } from "zod";
import { format } from "date-fns";

interface Props {
	transaction?: Transaction;
}

const props = defineProps<Props>();

const isEditing = computed(() => "transaction" in props);

const emit = defineEmits(["submitted"]);

const isOpen = defineModel<boolean>("isOpen", { required: true });

function handelUpdateIsOpen(value: boolean) {
	if (!value) resetForm();
}

// Form Part
const isLoading = ref(false);
const form = ref();
const defautSchema = z.object({
	id: z.number().optional(),
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
const sacingSchema = z.object({ type: z.literal("Saving") });

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
	created_at: format(new Date(), "yyyy-MM-dd"),
	description: undefined,
	category: undefined,
};
const state = reactive(
	isEditing.value
		? {
				type: props.transaction?.type as Schema["type"],
				amount: props.transaction?.amount as Schema["amount"],
				created_at: props.transaction?.created_at.split(
					"T"
				)[0] as Schema["created_at"],
				description: props.transaction?.description as Schema["description"],
				category: props.transaction?.category || undefined,
		  }
		: { ...initialState }
);

const supabase = useSupabaseClient<Database>();
const { toastSuccess, toastError } = useAppToast();
async function onSubmit(event: FormSubmitEvent<Schema>) {
	console.log("onSubmit", event.data);
	if (form.value.errors.length) return;

	isLoading.value = true;

	try {
		const { error } = await supabase
			.from("transactions")
			.upsert(
				isEditing.value ? { ...state, id: props.transaction?.id } : { ...state }
			);

		if (!error) {
			toastSuccess({
				title: "Transaction added",
			});
			isOpen.value = false;
			emit("submitted");
			return;
		}
		throw error;
	} catch (e) {
		toastError({
			title: "Transaction not submitted",
			description: (e as Error).message,
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
