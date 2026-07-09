<!--
This page and the components it uses are based on the example at:
https://www.skeleton.dev/docs/svelte/guides/cookbook/chat
-->

<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';

	import { openConnection } from '$lib/states/roomSocket.svelte';
	import Conversation from '$lib/components/room/Conversation.svelte';
	import MessagePrompt from '$lib/components/room/MessagePrompt.svelte';
	import PresenceList from '$lib/components/room/PresenceList.svelte';

	// When DOM is mounted, establish WebSocket connection
	onMount(() => {
		if (page.params.roomName) {
			openConnection(page.params.roomName);
		}
	});
</script>

<section class="card bg-surface-100-900 rounded-container overflow-hidden">
	<div class="chat w-full h-full grid grid-cols-1 lg:grid-cols-[30%_1fr]">
		<!-- Sidebar -->
		<div class="hidden lg:grid grid-rows-[auto_1fr_auto] border-r border-surface-200-800">
			<!-- Header -->
			<header class="border-b border-surface-200-800 p-4">
				<p>
					<b class="font-bold">Room: </b>
					<span>{page.params.roomName}</span>
				</p>
			</header>
			<!-- Presence -->
			<div class="p-4 space-y-4 overflow-y-auto">
				<p class="font-bold">Users in this room:</p>
				<PresenceList />
			</div>
		</div>
		<!-- Chat -->
		<div class="grid grid-rows-[1fr_auto]">
			<Conversation />
			<section class="border-t border-surface-200-800 p-4">
				<MessagePrompt />
			</section>
		</div>
	</div>
</section>
