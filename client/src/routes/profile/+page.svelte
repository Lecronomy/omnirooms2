<script lang="ts">
	import { ArrowRightIcon } from '@lucide/svelte';

	import GotoBar from '$lib/components/GotoBar.svelte';
	import PostPrompt from '$lib/components/profile/PostPrompt.svelte';
	import PostFeed from '$lib/components/profile/PostFeed.svelte';
</script>

<GotoBar pathPrefix="/profile" placeholder="Username">
	<span>Go to Profile</span>
	<ArrowRightIcon size={18} />
</GotoBar>

<hr class="hr my-2" />

<PostPrompt />
<PostFeed />
