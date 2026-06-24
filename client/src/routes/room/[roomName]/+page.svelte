<!-- Based on the example at https://www.skeleton.dev/docs/svelte/guides/cookbook/chat -->
<!-- This could maybe be split into components if I figure out how -->

<script lang="ts">
	import { SendIcon } from '@lucide/svelte';
	import { onMount } from 'svelte';
    import { page } from '$app/state';

	import { useMessageFeed, openConnection } from '$lib/states/messageFeed.svelte';

	let elemChat: HTMLElement;
	let currentMessage = $state('');

	const messageFeed = useMessageFeed();

	function scrollChatBottom(behavior?: 'auto' | 'instant' | 'smooth') {
		elemChat.scrollTo({ top: elemChat.scrollHeight, behavior });
	}

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

	// Scroll to bottom when message feed changes
	$effect(() => {
		// Subscribe to changes in the message feed
		void messageFeed.messages;
		// Smooth scroll to bottom
		// Timeout prevents race condition (at least in the original example, does it in this version?)
		setTimeout(() => scrollChatBottom('smooth'), 0);
	});

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
                <p>Presence list will go here</p>
            </div>
		</div>
		<!-- Chat -->
		<div class="grid grid-rows-[1fr_auto]">
			<!-- Conversation -->
			<section bind:this={elemChat} class="max-h-125 p-4 overflow-y-auto space-y-4">
				{#each messageFeed.messages as bubble (bubble.id)}
                    <div class="grid grid-cols-[auto_1fr] gap-2">
                        <!-- <Avatar src="https://i.pravatar.cc/?img={bubble.avatar}" name={bubble.name} size="size-12" /> -->
                        <div class="card p-4 preset-tonal rounded-tl-none space-y-2">
                            <header class="flex justify-between items-center">
                                <p class="font-bold">{bubble.name}</p>
                                <small class="opacity-50">{bubble.timestamp}</small>
                            </header>
                            <p>{bubble.message}</p>
                        </div>
                    </div>
				{/each}
			</section>
			<!-- Prompt -->
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
		</div>
	</div>
</section>
