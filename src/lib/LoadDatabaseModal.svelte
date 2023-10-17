<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { deleteLocalSave, getLocalSaveSize, getLocalSave } from './localDatabaseSave';
	import { browser } from '$app/environment';
	import prettyBytes from 'pretty-bytes';
	import surrealDeal from '$lib/examples/surreal_deal_v1.surql?raw';

	const modalStore = getModalStore();

	let nonce = 0;

	async function loadLocalSave() {
		const { data, start } = await getLocalSave();
		$modalStore[0].response?.({ data, start });
		modalStore.close();
	}

	async function loadSurrealDeal() {
		$modalStore[0].response?.({ data: [surrealDeal], start: 'select * from person limit 10;' });
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
							Size: {prettyBytes(size)}
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
	</div>
</div>
