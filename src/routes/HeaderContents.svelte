<script lang="ts">
	import { AppBar, LightSwitch, popup, type PopupSettings } from '@skeletonlabs/skeleton';

	let menuPopupSettings: PopupSettings = {
		event: 'click',
		target: 'menuPopup',
		middleware: {
			offset: 20
		}
	};
</script>

<!-- App Bar -->
<AppBar>
	<svelte:fragment slot="lead">
		<a href="/" class="btn hover:variant-filled-surface">
			<strong class="text-xl"><span class="gradient-heading">SurrealDB</span> Sandbox</strong>
		</a>
	</svelte:fragment>
	<svelte:fragment slot="trail">
		<LightSwitch />
		<a
			class="btn btn-icon-sm hover:variant-soft-surface"
			href="https://github.com/plasmatech8/surrealdb-sandbox"
			target="_blank"
		>
			<i class="fa-brands fa-github h-5" />
		</a>
	</svelte:fragment>
</AppBar>
