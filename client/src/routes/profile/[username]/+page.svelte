<script lang="ts">
	import PostFeed from '$lib/components/profile/PostFeed.svelte';
	import { page } from '$app/state';
</script>

<PostFeed username={page.params.username} />
