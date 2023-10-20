<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { deleteLocalSave, getLocalSaveSize, getLocalSave } from './localDatabaseSave';
	import { browser } from '$app/environment';
	import * as surrealDealExample from '$lib/examples/surreal_deal';
	import * as simpleAnimalsExample from '$lib/examples/simple_animals';

	const modalStore = getModalStore();

	let nonce = 0;

	async function loadLocalSave() {
		const { history, editors } = await getLocalSave();
		$modalStore[0].response?.({ history, editors });
		modalStore.close();
	}

	async function loadSurrealDeal() {
		$modalStore[0].response?.({
			history: surrealDealExample.history,
			editors: surrealDealExample.editors
		});
		modalStore.close();
	}

	async function loadSimpleAnimals() {
		$modalStore[0].response?.({
			history: simpleAnimalsExample.history,
			editors: simpleAnimalsExample.editors
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
		<header class="text-3xl">Load Database</header>
		<div class="text-lg font-semibold">Local Save</div>
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
