<script lang="ts">
	import { onMount } from 'svelte';
	import CodeEditor from './CodeEditor.svelte';
	import type { Surreal } from 'surrealdb.wasm';
	import exampleCode from '$lib/examples/surreal_deal_v1.surql?raw';
	import { Pane, Splitpanes } from 'svelte-splitpanes';
	import ResponseViewer from './ResponseViewer.svelte';

	let db: Surreal;
	let response: string;
	let code = 'select * from person;';

	onMount(async () => {
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
	});

	async function handleRun() {
		try {
			const resp = await db.query(code, {});
			response = JSON.stringify(resp, null, 4);
		} catch (error) {
			alert(error);
		}
	}

	async function loadExample() {
		try {
			await db.query(exampleCode, {});
			alert('done');
		} catch (error) {
			alert(error);
		}
	}
</script>

<div class="flex flex-col gap-5 p-5 h-full overflow-hidden">
	<!-- Toolbar -->
	<div class="flex gap-3">
		<button class="btn gap-3 variant-soft-secondary mr-auto" on:click={handleRun}>
			<i class="fas fa-bolt" />
			Run Query
		</button>

		<button class="btn gap-3 variant-soft-secondary">
			<i class="fas fa-arrow-rotate-left" />
			Reset
		</button>
		<button class="btn gap-3 variant-soft-secondary" on:click={loadExample}>
			<i class="fas fa-file-arrow-down" />
			Load
		</button>
		<button class="btn gap-3 variant-soft-secondary">
			<i class="fas fa-floppy-disk" />
			Save
		</button>
	</div>
	<!-- Code/Response section -->
	<Splitpanes class="flex-1 rounded-xl overflow-hidden">
		<Pane minSize={20}>
			<div class="h-full w-full flex flex-col">
				<div class="p-4 pb-1 flex gap-3 font-semibold text-lg items-center">
					<i class="fas fa-terminal opacity-50" />
					Query
				</div>
				<div class="flex-1 overflow-auto">
					<CodeEditor on:run={handleRun} bind:value={code} />
				</div>
			</div>
		</Pane>
		<Pane>
			<div class="w-full h-full flex flex-col !max-h-full">
				<div class="p-4 pb-1 flex gap-3 font-semibold text-lg items-center min-w-[10rem]">
					<i class="fas fa-database opacity-50" />
					Response
				</div>
				<div class="flex-1">
					<ResponseViewer value={response} />
				</div>
			</div>
		</Pane>
	</Splitpanes>
</div>
