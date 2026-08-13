<script lang="ts">
	import { resolve } from '$app/paths';

	import { useAuthState } from '$lib/states/authState.svelte';

	const authState = useAuthState();
</script>

{#if authState.user}
	<p>Logged in as: <b>{authState.user.username}</b></p>
{:else}
	<p>You are not logged in</p>
	<p>
		Please
		<a class="anchor" href={resolve('/auth/login')}>log in</a>
		or
		<a class="anchor" href={resolve('/auth/register')}>register</a>
		to access account settings!
	</p>
{/if}
