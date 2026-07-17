<script lang="ts">
	import { CircleUserIcon } from '@lucide/svelte';
	import { AppBar } from '@skeletonlabs/skeleton-svelte';

	import { useAuthState } from '$lib/states/authState.svelte';
	const authState = useAuthState();
</script>

<!-- TODO: Proper header design and functionality. This is just a placeholder for now. -->
<AppBar>
	<AppBar.Toolbar class="grid-cols-[auto_1fr_auto]">
		<AppBar.Headline>
			<p class="text-2xl">Omnirooms</p>
		</AppBar.Headline>
		<AppBar.Trail class="justify-end">
			<button type="button" class="btn-icon hover:preset-tonal">
				<CircleUserIcon class="size-6" />
			</button>
			{#if authState.user}
				<p>{authState.user.username}</p>
			{/if}
		</AppBar.Trail>
	</AppBar.Toolbar>
</AppBar>
