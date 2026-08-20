<!-- Children go in the button, placeholder is for the input field -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	type PathPrefix = '/room' | '/profile'; // Add more path prefixes as needed (not sure this should be hardcoded here)
	let { children, pathPrefix = '/room' as PathPrefix, placeholder = 'Page name' } = $props();

	let pageName = $state('');

	const gotoPage = () => {
		if (pageName.trim() === '') return;
		goto(resolve(`${pathPrefix}/${pageName}`));
	};
</script>

<div class="mx-auto w-full max-w-xl space-y-4">
	<div class="input-group grid-cols-[1fr_auto]">
		<input class="ig-input" type="text" {placeholder} bind:value={pageName} />
		<button class="ig-btn preset-filled-primary-500" onclick={gotoPage}>
			{@render children()}
		</button>
	</div>
</div>
