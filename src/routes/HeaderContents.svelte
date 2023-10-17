<script lang="ts">
	import { AppBar, LightSwitch } from '@skeletonlabs/skeleton';
	import pjson from '../../package.json?raw';
	const { version } = JSON.parse(pjson);
</script>

<!-- App Bar -->
<AppBar>
	<svelte:fragment slot="lead">
		<a href="/" class="btn hover:variant-soft-surface">
			<strong class="text-xl"><span class="gradient-heading">SurrealDB</span> Sandbox</strong>
		</a>
		<span class="text-sm opacity-20 ml-3">
			{version}
		</span>
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
