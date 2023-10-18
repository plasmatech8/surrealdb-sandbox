<script lang="ts">
	import { onMount } from 'svelte';
	import type { Surreal } from 'surrealdb.wasm';
	import { Pane, Splitpanes } from 'svelte-splitpanes';
	import { ProgressRadial, getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import { setLocalSave } from '$lib/localDatabaseSave';
	import LoadDatabaseModal from '$lib/LoadDatabaseModal.svelte';
	import ResponseSection from './ResponseSection.svelte';
	import QuerySection from './QuerySection.svelte';

	let modalStore = getModalStore();
	let toastStore = getToastStore();

	let pageWidth: number;
	let sandboxContainerEl: HTMLDivElement;

	let db: Surreal;
	let response: string;
	let loading = true;

	let history: string[] = [];
	let editors: string[] = [''];
	let editorIdx = 0;

	function triggerSuccessToast(message: string) {
		toastStore.trigger({
			message: `<i class="far fa-circle-check mr-1"></i> ${message}`,
			background: 'variant-filled-secondary',
			classes: 'pl-8'
		});
	}

	function triggerErrorToast(message: string) {
		toastStore.trigger({
			message: `<i class="fas fa-triangle-exclamation mr-1"></i> ${message}`,
			background: 'variant-filled-error',
			classes: 'pl-8'
		});
	}

	onMount(async () => {
		loading = true;
		await initDatabase();
		loading = false;
	});

	async function initDatabase(successCallback: () => void = () => {}) {
		history = [];
		editors = [''];
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
			console.log('Initialized SurrealDB with version: ' + version);
			// Select a specific namespace / database
			await db.use({ ns: 'test', db: 'test' });
			successCallback();
		} catch (e) {
			console.error(e);
			triggerErrorToast('Sorry, there was a problem initializing the database...');
		}
	}

	async function handleRun() {
		loading = true;
		try {
			await new Promise((r) => setTimeout(r, 10));
			const code = editors[editorIdx];
			const resp = await db.query(code, {});
			response = JSON.stringify(resp, null, 4);
			history = [...history, code];
		} catch (error) {
			console.log(error);
			if (error instanceof Error) {
				triggerErrorToast(error.message);
			} else if (typeof error === 'string') {
				triggerErrorToast(error);
			} else {
				console.error(error);
				triggerErrorToast('Something went wrong in the query.');
			}
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
					await initDatabase(() => triggerSuccessToast('Database reset!'));
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
			response: async (snapshot: { history: string[]; editors: string[] } | undefined) => {
				if (snapshot) {
					loading = true;
					await new Promise((r) => setTimeout(r, 800));
					await initDatabase();
					try {
						editors = snapshot.editors;
						for (const q of snapshot.history) {
							history.push(q);
							await db.query(q, {});
						}
						history = history;
						triggerSuccessToast('Database loaded!');
					} catch (error) {
						console.error(error);
						triggerErrorToast('Sorry, there was a problem loading the data...');
						await initDatabase();
						triggerSuccessToast('Database reset!');
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
			body: 'Overwrite existing local save snapshot?',
			response: async (r: boolean) => {
				if (r) {
					loading = true;
					try {
						const code = editors[editorIdx];
						await setLocalSave(history, [code]);
						triggerSuccessToast('Database saved!');
					} catch (error) {
						console.error(error);
						triggerErrorToast('Failed to save database.');
					}
					loading = false;
				}
			}
		});
	}
</script>

<svelte:head>
	<title>SurrealDB Sandbox</title>
	<meta
		name="description"
		content="Explore SurrealDB/SurrealQL in your browser. This online playground offers a query code editor and response viewer. It allows you to effortlessly test queries in a browser sandbox and experiment with your ideas."
	/>
</svelte:head>

<div class="flex flex-col gap-5 p-5 h-full overflow-hidden" bind:clientWidth={pageWidth}>
	<!-- Toolbar -->
	<div class="flex gap-3 overflow-auto">
		<button class="btn variant-soft-secondary mr-auto" on:click={handleRun} disabled={loading}>
			<i class="fas fa-bolt w-4 mr-1" />
			<span>Run <span class="hidden sm:inline">Query</span></span>
			<span class="opacity-50"> · </span>
			<span class="opacity-50">{history.length}</span>
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
	<div
		class="relative flex-1 transition-opacity"
		class:pointer-events-none={loading}
		class:opacity-50={loading}
		bind:this={sandboxContainerEl}
	>
		{#if loading}
			<div class="absolute top-0 left-0 w-full h-full grid place-items-center z-50">
				<ProgressRadial stroke={100} meter="stroke-secondary-500" />
			</div>
		{/if}

		<Splitpanes class="rounded-xl overflow-hidden" horizontal={pageWidth < 640}>
			<Pane minSize={20}>
				<QuerySection {editors} {editorIdx} on:run={handleRun} on:save={handleSaveButton} />
			</Pane>
			<Pane>
				<ResponseSection {response} />
			</Pane>
		</Splitpanes>
	</div>
</div>
