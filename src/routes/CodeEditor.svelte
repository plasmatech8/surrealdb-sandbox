<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let value: string;

	let clientHeight: number;
	let clientWidth: number;

	const dispatch = createEventDispatcher();

	function handleHotkey(e: KeyboardEvent) {
		if (e.metaKey && e.key == 'Enter') {
			e.preventDefault();
			dispatch('run', value);
		}
		if (e.metaKey && e.key == 's') {
			e.preventDefault();
			dispatch('save');
		}
	}

	const notypecheck = (x: any) => x;
</script>

<div class="h-full relative overflow-clip" bind:clientHeight bind:clientWidth>
	<div style="width: {clientWidth}px; height: {clientHeight}px;" class="absolute overflow-auto">
		<!-- svelte-ignore -->
		<div
			style="white-space: pre;"
			role="textbox"
			tabindex="0"
			contenteditable="true"
			{...notypecheck({ contenteditable: 'plaintext-only' })}
			bind:innerText={value}
			class="min-w-[17rem] p-5 pt-2 outline-none h-full"
			on:keydown={handleHotkey}
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
