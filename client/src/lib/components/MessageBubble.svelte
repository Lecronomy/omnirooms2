<script lang="ts">
	let { children, username = '', timestamp = '' } = $props();
</script>

<div class="grid grid-cols-[auto_1fr] gap-2">
	<!-- <Avatar src="https://i.pravatar.cc/?img={bubble.avatar}" name={bubble.name} size="size-12" /> -->
	<div class="card p-4 preset-tonal rounded-tl-none space-y-2">
		<header class="flex justify-between items-center">
			<p class="font-bold">{username}</p>
			<small class="opacity-50">{timestamp}</small>
		</header>
		<p>
			{@render children()}
		</p>
	</div>
</div>
