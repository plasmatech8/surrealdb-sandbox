<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let value: string;

	const dispatch = createEventDispatcher();

	function handleRun(e: KeyboardEvent) {
		if (e.metaKey && e.key == 'Enter') {
			dispatch('run', value);
		}
	}
</script>

<textarea
	name="code"
	bind:value
	on:change
	class="bg-surface-200-700-toke bg-transparent h-full w-full !border-none !outline-none !ring-0 resize-none"
	on:keydown={handleRun}
/>
