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
		<button class="btn btn-icon-sm hover:variant-soft-surface" use:popup={menuPopupSettings}>
			<i class="fa-solid fa-ellipsis-vertical h-5" />
		</button>
	</svelte:fragment>
</AppBar>

<nav class="list-nav card p-1 w-60 shadow-xl" data-popup={menuPopupSettings.target}>
	<ul>
		<li>
			<button class="w-full justify-start">
				<span class="badge bg-primary-500 aspect-square">
					<i class="fas fa-floppy-disk text-white" />
				</span>
				<span class="">Save</span>
			</button>
		</li>

		<li>
			<button class="w-full justify-start">
				<span class="badge bg-primary-500 aspect-square">
					<i class="fas fa-file-arrow-down text-white" />
				</span>
				<span class="">Load</span>
			</button>
		</li>
		<li>
			<a
				href="https://github.com/plasmatech8/skeleton-material-theme"
				target="_blank"
				class="focus:outline-none"
			>
				<span class="badge bg-primary-500 aspect-square">
					<i class="fa-brands fa-github text-white" />
				</span>
				<span class="flex-auto">GitHub Repository</span>
			</a>
		</li>
	</ul>
</nav>
