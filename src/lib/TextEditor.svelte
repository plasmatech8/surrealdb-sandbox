<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let value: string;

	let clientHeight: number;
	let clientWidth: number;
	let editorEl: HTMLDivElement;

	const dispatch = createEventDispatcher();

	function handleHotkey(e: KeyboardEvent) {
		if (e.ctrlKey || e.metaKey) {
			if (e.key == 'Enter') {
				e.preventDefault();
				dispatch('run', value);
			}
			if (e.key == 's') {
				e.preventDefault();
				dispatch('save');
			}
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

	function handlePasteText(e: ClipboardEvent & { currentTarget: EventTarget & HTMLDivElement }) {
		e.preventDefault();
		const text = e.clipboardData?.getData('text/plain');
		document.execCommand('insertText', false, text);
	}
</script>

<div class="h-full relative overflow-clip" bind:clientHeight bind:clientWidth>
	<div style="width: {clientWidth}px; height: {clientHeight}px;" class="absolute overflow-auto">
		<!-- contenteditable="plaintext-only" does not work in Firefox, and also throws a type error in editor -->
		<div
			bind:this={editorEl}
			style="white-space: pre;"
			role="textbox"
			tabindex="0"
			contenteditable="true"
			on:paste={handlePasteText}
			bind:innerText={value}
			class="min-w-[17rem] p-5 pt-2 outline-none h-full"
			on:keydown={handleHotkey}
			placeholder="Write a query here..."
			aria-label="Write a SurrealQL query"
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
