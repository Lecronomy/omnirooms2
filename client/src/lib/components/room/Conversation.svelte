<script lang="ts">
	import { useMessageFeed } from '$lib/states/roomSocket.svelte';
	import MessageBubble from '$lib/components/MessageBubble.svelte';

	const messageFeed = useMessageFeed();
	let elemChat: HTMLElement;

	function scrollChatBottom(behavior?: 'auto' | 'instant' | 'smooth') {
		elemChat.scrollTo({ top: elemChat.scrollHeight, behavior });
	}

	// Scroll to bottom when message feed changes
	$effect(() => {
		// Subscribe to changes in the message feed
		void messageFeed.messages;
		// Smooth scroll to bottom
		// Timeout prevents race condition (at least in the original example, does it in this version?)
		setTimeout(() => scrollChatBottom('smooth'), 0);
	});
</script>

<!-- Max height should probably be dynamic instead of hardcoded -->
<section bind:this={elemChat} class="max-h-125 p-4 overflow-y-auto space-y-4">
	{#each messageFeed.messages as bubble (bubble.id)}
		<MessageBubble username={bubble.user.username} timestamp={bubble.timestamp}>
			{bubble.message}
		</MessageBubble>
	{/each}
</section>
