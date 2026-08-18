<script lang="ts">
	import { Progress } from '@skeletonlabs/skeleton-svelte';

	import { usePostsState } from '$lib/states/postsState.svelte';

	let { username = null as string | null } = $props();

	const postsState = usePostsState();

	$effect(() => {
		if (username) {
			postsState.fetchUserPosts(username);
		} else {
			postsState.fetchMyPosts();
		}
	});
</script>

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
