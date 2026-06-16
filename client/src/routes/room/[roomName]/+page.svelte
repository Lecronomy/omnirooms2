<!-- Based on the example at https://www.skeleton.dev/docs/svelte/guides/cookbook/chat -->

<script lang="ts">
	import { SendIcon } from '@lucide/svelte';
	import { onMount } from 'svelte';
    import { page } from '$app/state';

	interface MessageFeed {
		id: number;
		name: string;
		timestamp: string;
		message: string;
	}

	let elemChat: HTMLElement;
	const lorem =
		'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Provident blanditiis quidem dolorum ab similique. Voluptatibus quibusdam unde mollitia corrupti assumenda libero. Quibusdam culpa illum unde asperiores accusantium! Unde, cupiditate tenetur.';

	// Messages
	let messageFeed: MessageFeed[] = $state([
		{
			id: 0,
			name: 'Jane',
			timestamp: 'Yesterday @ 2:30pm',
			message: lorem,
		},
		{
			id: 1,
			name: 'Michael',
			timestamp: 'Yesterday @ 2:45pm',
			message: lorem,
		},
		{
			id: 2,
			name: 'Jane',
			timestamp: 'Yesterday @ 2:50pm',
			message: lorem,
		},
		{
			id: 3,
			name: 'Michael',
			timestamp: 'Yesterday @ 2:52pm',
			message: lorem,
		},
	]);
	let currentMessage = $state('');

	function scrollChatBottom(behavior?: 'auto' | 'instant' | 'smooth') {
		elemChat.scrollTo({ top: elemChat.scrollHeight, behavior });
	}

	function getCurrentTimestamp(): string {
		return new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
	}

	function addMessage() {
		const newMessage = {
			id: messageFeed.length,
			name: 'Jane',
			timestamp: `Today @ ${getCurrentTimestamp()}`,
			message: currentMessage,
		};
		// Update the message feed
		messageFeed = [...messageFeed, newMessage];
		// Clear prompt
		currentMessage = '';
		// Smooth scroll to bottom
		// Timeout prevents race condition
		setTimeout(() => scrollChatBottom('smooth'), 0);
	}

	function onPromptKeydown(event: KeyboardEvent) {
		if (['Enter'].includes(event.code)) {
			event.preventDefault();
			addMessage();
		}
	}

	// When DOM is mounted, scroll to bottom
	onMount(() => {
		scrollChatBottom();
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
				{#each messageFeed as bubble (bubble.id)}
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
