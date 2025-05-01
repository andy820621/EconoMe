<template>
	<header class="flex justify-between items-center mt-5">
		<NuxtLink to="/" class="text-xl font-bold">Finance Tracker</NuxtLink>
		<div>
			<UDropdownMenu
				:items="items"
				:ui="{ item: { disabled: 'cursor-text select-text' }, width: 'w-64' }"
				v-if="user"
			>
				<UAvatar :src="avatarUrl" alt="Avatar" imgClass="object-cover" />

				<template #account>
					<div class="text-left">
						<p>Signed in as</p>
						<p
							v-if="user.email"
							class="font-medium text-neutral-900 dark:text-white"
						>
							{{ user.email }}
						</p>
					</div>
				</template>

				<template #item="{ item }">
					<span class="truncate">{{ item.label }}</span>

					<UIcon
						:name="item.icon ?? ''"
						class="shrink-0 h-4 w-4 text-neutral-400 dark:text-neutral-500 ms-auto"
					/>
				</template>
			</UDropdownMenu>
		</div>
	</header>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient<Database>();
const user = useSupabaseUser();
const { url: avatarUrl } = useAvatarUrl();

const items = [
	[
		{
			label: user.value?.email!,
			slot: "account",
			disabled: true,
		},
	],
	[
		{
			label: "Settings",
			icon: "i-heroicons-cog-8-tooth",
			onSelect: () => navigateTo("/settings/profile"),
		},
		{
			label: "Sign out",
			icon: "i-heroicons-arrow-left-on-rectangle",
			onSelect: async () => {
				await supabase.auth.signOut();
				return navigateTo("/login");
			},
		},
	],
];
</script>
