<script lang="ts">
	import '../app.postcss';
	import { AppShell } from '@skeletonlabs/skeleton';
	import HeaderContents from './HeaderContents.svelte';

	// Font Awesome icons
	import '@fortawesome/fontawesome-free/js/all.min.js';

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
