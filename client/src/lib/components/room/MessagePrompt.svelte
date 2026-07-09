<script lang="ts">
	import { SendIcon } from '@lucide/svelte';

	import { useMessageFeed } from '../../states/roomSocket.svelte';
	import { useAuthState } from '$lib/states/authState.svelte';

	const messageFeed = useMessageFeed();
	const authState = useAuthState();

	let currentMessage = $state('');
	let isAuthenticated = $derived(authState.user !== null);

	function addMessage() {
		if (currentMessage.trim() === '') return;
		// Send message through WebSocket
		messageFeed.sendMessage(currentMessage);
		// Clear prompt
		currentMessage = '';
	}

	function onPromptKeydown(event: KeyboardEvent) {
		if (['Enter'].includes(event.code)) {
			event.preventDefault();
			addMessage();
		}
	}
</script>

<div
	class="input-group grid-cols-[auto_1fr_auto] divide-x divide-surface-200-800 rounded-container-token"
>
	<button class="input-group-cell preset-tonal">+</button>
	<textarea
		value={currentMessage}
		oninput={(e) => (currentMessage = e.currentTarget.value)}
		class="bg-transparent border-0 ring-0"
		name="prompt"
		id="prompt"
		placeholder={isAuthenticated ? 'Write your message...' : 'Please log in to send messages!'}
		rows="1"
		onkeydown={onPromptKeydown}
		disabled={!isAuthenticated}
	></textarea>
	<button
		class="input-group-cell {currentMessage ? 'preset-filled-primary-500' : 'preset-tonal'}"
		onclick={addMessage}
		disabled={!isAuthenticated || !currentMessage.trim()}
	>
		<SendIcon />
	</button>
</div>
