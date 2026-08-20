<script lang="ts">
	import { Progress } from '@skeletonlabs/skeleton-svelte';

	import { usePostsState } from '$lib/states/postsState.svelte';
	import { useAuthState } from '$lib/states/authState.svelte';
	import MessageBubble from '../MessageBubble.svelte';

	let { username = '' } = $props();

	const postsState = usePostsState();
	const authState = useAuthState();

	$effect(() => {
		if (username !== '') {
			postsState.fetchUserPosts(username);
		} else {
			username = authState.user?.username ?? 'Unknown user';
			postsState.fetchMyPosts();
		}
	});
</script>

<h2 class="h2">
	{username}'s posts
</h2>

{#if postsState.loading}
	<Progress class="items-center w-fit" value={null}>
		<Progress.Circle>
			<Progress.CircleTrack />
			<Progress.CircleRange />
		</Progress.Circle>
		<Progress.ValueText />
	</Progress>
{:else}
	<!-- Max height should probably be dynamic instead of hardcoded -->
	<section class="max-h-75 p-4 overflow-y-auto space-y-4">
		{#each postsState.posts as post (post.id)}
			<MessageBubble {username} timestamp={post.createdAt.toLocaleString()}>
				{post.content}
			</MessageBubble>
		{/each}
	</section>
{/if}
