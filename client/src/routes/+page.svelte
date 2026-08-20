<script lang="ts">
	import { ArrowRightIcon } from '@lucide/svelte';

	import GotoBar from '$lib/components/GotoBar.svelte';
</script>

<GotoBar pathPrefix="/room" placeholder="Room name">
	<span>Go to Room</span>
	<ArrowRightIcon size={18} />
</GotoBar>
