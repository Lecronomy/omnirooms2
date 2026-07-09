<script lang="ts">
	import { usePresenceState } from '$lib/states/roomSocket.svelte';

	const presenceState = usePresenceState();
</script>

<ul class="list-inside list-none space-y-2">
	{#each presenceState.users as user (user.id)}
		<li>{user.username}</li>
	{/each}
</ul>
