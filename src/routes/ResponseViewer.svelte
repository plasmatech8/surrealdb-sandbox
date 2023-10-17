<script lang="ts">
	export let value: string | undefined;

	let clientHeight: number;
	let clientWidth: number;
</script>

<div class="h-full w-full relative overflow-clip" bind:clientHeight bind:clientWidth>
	<div style="width: {clientWidth}px; height: {clientHeight}px;" class="absolute overflow-auto">
		{#if value}
			<div class="min-w-[30rem] p-5 pt-2 text-sm">
				<pre>{value}</pre>
			</div>
		{:else}
			<div class="min-w-[10rem] h-full grid place-items-center">
				<span class="opacity-50 whitespace-nowrap">No Response</span>
			</div>
		{/if}
	</div>
</div>
