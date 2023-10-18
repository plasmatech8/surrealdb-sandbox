<script lang="ts">
	import { onMount } from 'svelte';
	import CodeEditor from './CodeEditor.svelte';
	import type { Surreal } from 'surrealdb.wasm';
	import { Pane, Splitpanes } from 'svelte-splitpanes';
	import ResponseViewer from './ResponseViewer.svelte';
	import { ProgressRadial, getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import { setLocalSave } from '$lib/localDatabaseSave';
	import LoadDatabaseModal from '$lib/LoadDatabaseModal.svelte';
	import { browser } from '$app/environment';

	let modalStore = getModalStore();
	let toastStore = getToastStore();

	let pageWidth: number;

	let db: Surreal;
	let response: string;
	let code = '';
	let loading = true;

	let queryHistory: string[] = [];
	let codeContainerEl: HTMLDivElement;

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
			const resp = await db.query(code, {});
			response = JSON.stringify(resp, null, 4);
			queryHistory = [...queryHistory, code];
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
						queryHistory = queryHistory;
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
			body: 'Overwrite existing local save?',
			response: async (r: boolean) => {
				if (r) {
					loading = true;
					try {
						await setLocalSave(queryHistory, code);
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

	function getOS() {
		let os = null;
		if (browser) {
			let userAgent = window.navigator.userAgent.toLowerCase(),
				macosPlatforms = /(macintosh|macintel|macppc|mac68k|macos)/i,
				windowsPlatforms = /(win32|win64|windows|wince)/i,
				iosPlatforms = /(iphone|ipad|ipod)/i;
			if (macosPlatforms.test(userAgent)) {
				os = 'macos';
			} else if (iosPlatforms.test(userAgent)) {
				os = 'ios';
			} else if (windowsPlatforms.test(userAgent)) {
				os = 'windows';
			} else if (/android/.test(userAgent)) {
				os = 'android';
			} else if (!os && /linux/.test(userAgent)) {
				os = 'linux';
			}
		}
		return os;
	}
</script>

<div class="flex flex-col gap-5 p-5 h-full overflow-hidden" bind:clientWidth={pageWidth}>
	<!-- Toolbar -->
	<div class="flex gap-3 overflow-auto">
		<button class="btn variant-soft-secondary mr-auto" on:click={handleRun} disabled={loading}>
			<i class="fas fa-bolt w-4 mr-1" />
			<span>Run <span class="hidden sm:inline">Query</span></span>
			<span class="opacity-50"> · </span>
			<span class="opacity-50">{queryHistory.length}</span>
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
		bind:this={codeContainerEl}
	>
		{#if loading}
			<div class="absolute top-0 left-0 w-full h-full grid place-items-center z-50">
				<ProgressRadial stroke={100} meter="stroke-secondary-500" />
			</div>
		{/if}

		<Splitpanes class="rounded-xl overflow-hidden" horizontal={pageWidth < 640}>
			<Pane minSize={20}>
				<div class="h-full w-full flex flex-col">
					<div class="flex justify-between">
						<div class="p-4 pb-1 flex gap-4 font-semibold text-lg items-center">
							<i class="fas fa-terminal opacity-50 w-5" />
							Query
						</div>
						<div class="opacity-20 p-4 text-sm font-semibold">
							{#if ['macos', 'ios'].includes(getOS() ?? '')}
								<kbd class="kbd text-xs">⌘</kbd> +
								<kbd class="kbd text-xs">return</kbd>
							{:else}
								<kbd class="kbd text-xs">ctrl</kbd> +
								<kbd class="kbd text-xs">enter</kbd>
							{/if}
						</div>
					</div>
					<div class="flex-1 overflow-clip">
						<CodeEditor on:run={handleRun} on:save={handleSaveButton} bind:value={code} />
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
