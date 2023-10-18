<script lang="ts">
	import TextViewer from '$lib/TextViewer.svelte';

	export let response: string;
</script>

<div class="w-full h-full flex flex-col !max-h-full">
	<div class="p-4 pb-1 flex gap-4 font-semibold text-lg items-center min-w-[10rem]">
		<i class="fas fa-database opacity-50 w-5" />
		Response
	</div>
	<div class="flex-1 overflow-clip">
		<TextViewer value={response} />
	</div>
</div>
