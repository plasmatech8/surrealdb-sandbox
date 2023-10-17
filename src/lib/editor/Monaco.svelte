<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type * as Monaco from 'monaco-editor/esm/vs/editor/editor.api';

	let editor: Monaco.editor.IStandaloneCodeEditor;
	let monaco: typeof Monaco;
	let editorContainer: HTMLElement;

	onMount(async () => {
		// Import our 'monaco.ts' file here
		// (onMount() will only be executed in the browser, which is what we want)
		monaco = (await import('./monaco')).default;

		// Your monaco instance is ready, let's display some code!
		const editor = monaco.editor.create(editorContainer);
		const model = monaco.editor.createModel('{"asd": "asd"}', 'surql');
		editor.setModel(model);
	});

	onDestroy(() => {
		monaco?.editor.getModels().forEach((model) => model.dispose());
		editor?.dispose();
	});
</script>

<div>
	<div class="container" bind:this={editorContainer} />
</div>

<style>
	.container {
		width: 100%;
		height: 600px;
	}
</style>
