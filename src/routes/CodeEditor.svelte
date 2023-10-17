<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let value: string;

	let clientHeight: number;
	let clientWidth: number;

	const dispatch = createEventDispatcher();

	function handleRun(e: KeyboardEvent) {
		if (e.metaKey && e.key == 'Enter') {
			dispatch('run', value);
		}
	}
</script>

<div class="h-full relative overflow-clip" bind:clientHeight bind:clientWidth>
	<div style="width: {clientWidth}px; height: {clientHeight}px;" class="absolute overflow-auto">
		<div
			role="textbox"
			tabindex="0"
			contenteditable="true"
			bind:textContent={value}
			class="min-w-[30rem] p-5 pt-2 outline-none h-full"
			on:keydown={handleRun}
			placeholder="Write a query here..."
		/>
	</div>
</div>

<style>
	[placeholder]:empty::before {
		content: attr(placeholder);
		opacity: 30%;
	}

	[placeholder]:empty:focus::before {
		content: '';
	}
</style>
