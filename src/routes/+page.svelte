<script lang="ts">
	import { onMount } from 'svelte';
	import CodeEditor from './CodeEditor.svelte';
	import type { Surreal } from 'surrealdb.wasm';
	import exampleCode from '$lib/examples/surreal_deal_v1.surql?raw';
	import { Pane, Splitpanes } from 'svelte-splitpanes';

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

	async function handleRun(e: CustomEvent) {
		try {
			const resp = await db.query(e.detail, {});
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
	<button on:click={loadExample}>Load Surreal_Deal Example</button>
	<Splitpanes style="height: 400px" class="flex-1 rounded-xl overflow-hidden">
		<Pane minSize={20}>
			<CodeEditor on:run={handleRun} bind:value={code} />
		</Pane>
		<Pane>
			{#if response}
				<pre>{response}</pre>
			{:else}
				<div class="w-full h-full grid place-items-center overflow-auto">
					<span class="opacity-50">No Response</span>
				</div>
			{/if}
		</Pane>
	</Splitpanes>
</div>
