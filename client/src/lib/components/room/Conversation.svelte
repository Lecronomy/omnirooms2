<script lang="ts">
	import { useMessageFeed } from '$lib/states/roomSocket.svelte';

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

<section bind:this={elemChat} class="max-h-125 p-4 overflow-y-auto space-y-4">
	{#each messageFeed.messages as bubble (bubble.id)}
		<div class="grid grid-cols-[auto_1fr] gap-2">
			<!-- <Avatar src="https://i.pravatar.cc/?img={bubble.avatar}" name={bubble.name} size="size-12" /> -->
			<div class="card p-4 preset-tonal rounded-tl-none space-y-2">
				<header class="flex justify-between items-center">
					<p class="font-bold">{bubble.user.username}</p>
					<small class="opacity-50">{bubble.timestamp}</small>
				</header>
				<p>{bubble.message}</p>
			</div>
		</div>
	{/each}
</section>
