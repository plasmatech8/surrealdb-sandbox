<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { deleteLocalSave, getLocalSaveSize, getLocalSave } from './localDatabaseSave';
	import { browser } from '$app/environment';
	import surrealDeal from '$lib/examples/surreal_deal_v1.surql?raw';

	const modalStore = getModalStore();

	let nonce = 0;

	async function loadLocalSave() {
		const { history, editors } = await getLocalSave();
		$modalStore[0].response?.({ history, editors });
		modalStore.close();
	}

	async function loadSurrealDeal() {
		const startCode = `
select
    *,
     ->order.* as orders,
     ->order->product.* as orders.products,
    (select *, product.* from review where person = $parent.id) as reviews
from person
limit 1;
`;
		$modalStore[0].response?.({
			history: [surrealDeal],
			editors: [startCode]
		});
		modalStore.close();
	}

	async function loadSimpleAnimals() {
		const startCode = `
update animal:dog content { sound: 'bark!' };
update animal:cat content { sound: 'meow!' };

select * from animal;
`;
		$modalStore[0].response?.({
			history: [],
			editors: [startCode]
		});
		modalStore.close();
	}

	async function onDeleteLocalSave() {
		await deleteLocalSave();
		nonce += 1;
	}
</script>

<div class="card px-10 py-6 w-modal">
	<div class="flex flex-col gap-5">
		<header class="text-3xl">Load Data</header>
		<div class="text-lg font-semibold">Local Database Save</div>
		<div class="flex gap-10">
			{#key nonce}
				{#if browser}
					{@const size = getLocalSaveSize()}
					<button class="btn variant-soft-secondary" on:click={loadLocalSave} disabled={!size}>
						{#if size}
							Size: {size}
						{:else}
							No Save
						{/if}
					</button>
					{#if size}
						<button class="btn btn-icon variant-soft-error" on:click={onDeleteLocalSave}>
							<i class="fa-regular fa-trash-can" />
						</button>
					{/if}
				{/if}
			{/key}
		</div>
		<div class="text-lg font-semibold">Examples</div>
		<div>
			<button class="btn variant-soft-secondary" on:click={loadSurrealDeal}>Surreal Deal</button>
			<span class="ml-2">
				From the
				<a href="https://surrealdb.com/docs/surrealql/demo" target="_blank" class="anchor">
					SurrealDB docs
				</a>
			</span>
		</div>
		<div>
			<button class="btn variant-soft-secondary" on:click={loadSimpleAnimals}>
				Simple Animals Demo</button
			>
		</div>
	</div>
</div>
