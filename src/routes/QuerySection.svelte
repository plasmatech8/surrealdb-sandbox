<script lang="ts">
	import { browser } from '$app/environment';
	import TextEditor from '$lib/TextEditor.svelte';

	export let editors: string[];
	export let editorIdx: number;

	function getOS() {
		let os = null;
		if (browser) {
			let userAgent = window.navigator.userAgent.toLowerCase(),
				macosPlatforms = /(macintosh|macintel|macppc|mac68k|macos)/i,
				windowsPlatforms = /(win32|win64|windows|wince)/i,
				iosPlatforms = /(iphone|ipad|ipod)/i;
			if (macosPlatforms.test(userAgent)) {
				os = 'macos';
			} else if (iosPlatforms.test(userAgent)) {
				os = 'ios';
			} else if (windowsPlatforms.test(userAgent)) {
				os = 'windows';
			} else if (/android/.test(userAgent)) {
				os = 'android';
			} else if (!os && /linux/.test(userAgent)) {
				os = 'linux';
			}
		}
		return os;
	}
</script>

<div class="h-full w-full flex flex-col">
	<div class="flex justify-between">
		<div class="p-4 pb-1 flex gap-4 font-semibold text-lg items-center">
			<i class="fas fa-terminal opacity-50 w-5" />
			Query
		</div>
		<div class="opacity-20 p-4 text-sm font-semibold whitespace-nowrap">
			{#if ['macos', 'ios'].includes(getOS() ?? '')}
				<kbd class="kbd text-xs">⌘</kbd> +
				<kbd class="kbd text-xs">return</kbd>
			{:else}
				<kbd class="kbd text-xs">ctrl</kbd> +
				<kbd class="kbd text-xs">enter</kbd>
			{/if}
		</div>
	</div>
	<div class="flex-1 overflow-clip">
		<TextEditor on:run on:save bind:value={editors[editorIdx]} />
	</div>
</div>
