<script lang="ts">
	import '../app.postcss';
	import { AppShell, Modal, Toast, modeCurrent } from '@skeletonlabs/skeleton';
	import HeaderContents from './HeaderContents.svelte';

	// Font Awesome icons
	import '@fortawesome/fontawesome-free/js/all.min.js';

	// Skeleton modal/toast stores
	import { initializeStores } from '@skeletonlabs/skeleton';
	initializeStores();

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
</script>

<!-- App Shell -->
<AppShell>
	<!-- Header -->
	<svelte:fragment slot="header">
		<HeaderContents />
	</svelte:fragment>
	<!-- Page Content -->
	<slot />
</AppShell>

<Toast position="br" />

<Modal />

<!-- Handle dark/light color for highlight.js -->
{#if $modeCurrent}
	<style lang="postcss" global>
		@import 'highlight.js/styles/github.css';
	</style>
{:else}
	<style lang="postcss" global>
		@import 'highlight.js/styles/github-dark.css';
	</style>
{/if}
