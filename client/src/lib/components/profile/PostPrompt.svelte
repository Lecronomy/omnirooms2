<script lang="ts">
	import { usePostsState } from '$lib/states/postsState.svelte';

	const postsState = usePostsState();

	let newPostContent = $state('');
	const submitPost = async () => {
		if (newPostContent.trim() === '') return;

		await postsState.createPost(newPostContent);
		newPostContent = '';
	};
</script>

<textarea class="textarea" rows="4" placeholder="Write a post..." bind:value={newPostContent}
></textarea>
<button class="btn preset-filled-primary-500 mt-2" onclick={submitPost}>Create Post</button>
