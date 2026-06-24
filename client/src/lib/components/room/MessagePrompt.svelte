<script lang="ts">
    import { SendIcon } from '@lucide/svelte';

    import { useMessageFeed } from '$lib/states/messageFeed.svelte';

    const messageFeed = useMessageFeed();
    let currentMessage = $state('');

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

<section class="border-t border-surface-200-800 p-4">
    <div class="input-group grid-cols-[auto_1fr_auto] divide-x divide-surface-200-800 rounded-container-token">
        <button class="input-group-cell preset-tonal">+</button>
        <textarea
            value={currentMessage}
            oninput={(e) => (currentMessage = e.currentTarget.value)}
            class="bg-transparent border-0 ring-0"
            name="prompt"
            id="prompt"
            placeholder="Write a message..."
            rows="1"
            onkeydown={onPromptKeydown}
        ></textarea>
        <button class="input-group-cell {currentMessage ? 'preset-filled-primary-500' : 'preset-tonal'}" onclick={addMessage}>
            <SendIcon />
        </button>
    </div>
</section>
