<script lang="ts">
	export let value: string;
</script>

{#if value}
	<textarea
		name="result"
		readonly
		bind:value
		class="bg-surface-200-700-toke bg-transparent h-full w-full min-w-[50rem] !border-none !outline-none !ring-0 resize-none"
	/>
{:else}
	<div class="w-full h-full grid place-items-center overflow-auto">
		<span class="opacity-50 whitespace-nowrap">No Response</span>
	</div>
{/if}
