<script lang="ts">
	import { resolve } from '$app/paths';
	import { LogInIcon, UserPlusIcon, LogOutIcon } from '@lucide/svelte';
	import { AppBar } from '@skeletonlabs/skeleton-svelte';

	import { useAuthState } from '$lib/states/authState.svelte';
	const authState = useAuthState();

	const logout = () => {
		authState.logout();
		window.location.reload();
	};
</script>

<!-- TODO: Proper header design and functionality. This is just a placeholder for now. -->
<AppBar>
	<AppBar.Toolbar class="grid-cols-[auto_1fr_auto]">
		<AppBar.Headline>
			<p class="text-2xl">Omnirooms</p>
		</AppBar.Headline>
		<AppBar.Trail class="justify-end">
			{#if authState.user}
				<span class="flex items-center">{authState.user.username}</span>
				<button
					type="button"
					class="btn-icon hover:preset-tonal"
					title="Log out"
					aria-label="Log out"
					onclick={logout}
				>
					<LogOutIcon class="size-6" />
				</button>
			{:else}
				<a
					class="btn-icon hover:preset-tonal"
					href={resolve('/auth/login')}
					title="Log in"
					aria-label="Log in"
				>
					<LogInIcon class="size-6" />
				</a>
				<a
					href={resolve('/auth/register')}
					class="btn-icon hover:preset-tonal"
					title="Register"
					aria-label="Register"
				>
					<UserPlusIcon class="size-6" />
				</a>
			{/if}
		</AppBar.Trail>
	</AppBar.Toolbar>
</AppBar>
