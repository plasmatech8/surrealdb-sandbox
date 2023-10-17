<script lang="ts">
	export let value: string;

	let clientHeight: number;
	let clientWidth: number;
</script>

<div class="h-full relative overflow-clip" bind:clientHeight bind:clientWidth>
	<div style="width: {clientWidth}px; height: {clientHeight}px;" class="absolute overflow-auto">
		<div class="min-w-[30rem] p-5 pt-2">
			{value}
		</div>
	</div>
</div>
