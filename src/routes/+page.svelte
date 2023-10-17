<script lang="ts">
	import { onMount } from 'svelte';
	import CodeEditor from './CodeEditor.svelte';
	import type { Surreal } from 'surrealdb.wasm';
	import { Pane, Splitpanes } from 'svelte-splitpanes';
	import ResponseViewer from './ResponseViewer.svelte';
	import { ProgressRadial, getModalStore } from '@skeletonlabs/skeleton';
	import { setLocalSave } from '$lib/indexedDB';
	import LoadDatabaseModal from '$lib/LoadDatabaseModal.svelte';

	let modalStore = getModalStore();

	let pageWidth: number;

	let db: Surreal;
	let response: string;
	let code = '';
	let loading = true;

	let queryHistory: string[] = [];

	onMount(async () => {
		loading = true;
		await initDatabase();
		loading = false;
	});

	async function initDatabase() {
		queryHistory = [];
		code = '';
		response = '';
		const { Surreal } = await import('surrealdb.wasm');
		db = new Surreal();
		try {
			// Connect to the database
			await db.connect('mem://', {
				// Set the namespace and database for the connection
				ns: 'test',
				db: 'test',
				// Set the authentication details for the connection
				auth: {
					NS: 'test',
					DB: 'test',
					SC: 'user',
					user: 'root',
					pass: 'root'
				}
			});
			const version = await db.version();
			console.log('Instantiated SurrealDB with version: ' + version);
			// Select a specific namespace / database
			await db.use({ ns: 'test', db: 'test' });
		} catch (e) {
			console.error('ERROR', e);
		}
	}

	async function handleRun() {
		loading = true;
		try {
			const resp = await db.query(code, {});
			response = JSON.stringify(resp, null, 4);
			queryHistory.push(code);
		} catch (error) {
			alert(error);
		}
		loading = false;
	}

	function handleResetButton() {
		modalStore.trigger({
			type: 'confirm',
			title: 'Reset Database',
			body: 'Clear to empty database?',
			response: async (r: boolean) => {
				if (r) {
					loading = true;
					await initDatabase();
					loading = false;
				}
			}
		});
	}

	async function handleLoadButton() {
		modalStore.trigger({
			type: 'component',
			component: {
				ref: LoadDatabaseModal
			},
			response: async (state: { data: string[]; start: string } | undefined) => {
				if (state) {
					loading = true;
					await new Promise((r) => setTimeout(r, 800));
					await initDatabase();
					try {
						code = state.start;
						for (const q of state.data) {
							queryHistory.push(q);
							await db.query(q, {});
						}
						alert('Loaded data');
					} catch (error) {
						alert(error);
						await initDatabase();
					}
					loading = false;
				}
			}
		});
	}

	async function handleSaveButton() {
		modalStore.trigger({
			type: 'confirm',
			title: 'Save Database',
			body: 'Overwrite existing save?',
			response: async (r: boolean) => {
				if (r) {
					loading = true;
					await setLocalSave(queryHistory, code);
					loading = false;
				}
			}
		});
	}
</script>

<div class="flex flex-col gap-5 p-5 h-full overflow-hidden" bind:clientWidth={pageWidth}>
	<!-- Toolbar -->
	<div class="flex gap-3 overflow-auto">
		<button
			class="btn gap-3 variant-soft-secondary mr-auto"
			on:click={handleRun}
			disabled={loading}
		>
			<i class="fas fa-bolt w-4" />
			Run Query
		</button>

		<button
			class="btn gap-2 variant-soft-secondary"
			on:click={handleResetButton}
			disabled={loading}
		>
			<i class="fas fa-arrow-rotate-left w-4" />
			<span class="hidden sm:inline">Reset</span>
		</button>
		<button class="btn gap-2 variant-soft-secondary" on:click={handleLoadButton} disabled={loading}>
			<i class="fas fa-file-arrow-down w-4" />
			<span class="hidden sm:inline">Load</span>
		</button>
		<button class="btn gap-2 variant-soft-secondary" on:click={handleSaveButton} disabled={loading}>
			<i class="fas fa-floppy-disk w-4" />
			<span class="hidden sm:inline">Save</span>
		</button>
	</div>
	<!-- Code/Response section -->
	<div class="relative flex-1" class:pointer-events-none={loading} class:opacity-50={loading}>
		{#if loading}
			<div class="absolute top-0 left-0 w-full h-full grid place-items-center z-50">
				<ProgressRadial stroke={100} meter="stroke-secondary-500" />
			</div>
		{/if}

		<Splitpanes class="rounded-xl overflow-hidden" horizontal={pageWidth < 640}>
			<Pane minSize={20}>
				<div class="h-full w-full flex flex-col">
					<div class="p-4 pb-1 flex gap-4 font-semibold text-lg items-center">
						<i class="fas fa-terminal opacity-50 w-5" />
						Query
					</div>
					<div class="flex-1 overflow-clip">
						<CodeEditor on:run={handleRun} bind:value={code} />
					</div>
				</div>
			</Pane>
			<Pane>
				<div class="w-full h-full flex flex-col !max-h-full">
					<div class="p-4 pb-1 flex gap-4 font-semibold text-lg items-center min-w-[10rem]">
						<i class="fas fa-database opacity-50 w-5" />
						Response
					</div>
					<div class="flex-1 overflow-clip">
						<ResponseViewer value={response} />
					</div>
				</div>
			</Pane>
		</Splitpanes>
	</div>
</div>
