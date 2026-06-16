<script lang="ts">
	import "../app.css";
	import favicon from '$lib/assets/favicon.svg';
	import ORHeader from '$lib/components/ORHeader.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ORHeader />

{@render children()}
