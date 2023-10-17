<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let value: string;

	let clientHeight: number;
	let clientWidth: number;
	let editorEl: HTMLDivElement;

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
		if (e.shiftKey && e.key == 'Tab') {
			e.preventDefault();
			changeTabSpacesForSelectedLines(-4);
		} else if (e.key == 'Tab') {
			e.preventDefault();
			changeTabSpacesForSelectedLines(4);
		}
	}

	function changeTabSpacesForSelectedLines(count: number) {
		const selection = window.getSelection();
		if (selection == null) return;
		if (selection.rangeCount > 0) {
			const range = selection.getRangeAt(0);
			editorEl.childNodes.forEach((node) => {
				if (range.intersectsNode(node)) {
					if (count < 0) {
						node.textContent = node.textContent?.replace(/^\s{0,4}/, '') as string;
					} else {
						node.textContent = '    ' + node.textContent;
					}
				}
			});
		}
	}

	const notypecheck = (x: any) => x;
</script>

<div class="h-full relative overflow-clip" bind:clientHeight bind:clientWidth>
	<div style="width: {clientWidth}px; height: {clientHeight}px;" class="absolute overflow-auto">
		<div
			bind:this={editorEl}
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
