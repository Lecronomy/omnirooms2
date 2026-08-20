<script lang="ts">
	import { Progress } from '@skeletonlabs/skeleton-svelte';

	import { usePostsState } from '$lib/states/postsState.svelte';
	import { useAuthState } from '$lib/states/authState.svelte';

	let { username = null as string | null } = $props();

	const postsState = usePostsState();
	const authState = useAuthState();

	$effect(() => {
		if (username) {
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
	{#each postsState.posts as post (post.id)}
		<div class="card w-full max-w-md preset-filled-surface-100-900 p-4">
			<p>{post.content}</p>
			<small>Posted on {post.createdAt.toLocaleString()}</small>
		</div>
	{/each}
{/if}
