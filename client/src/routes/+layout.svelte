<script lang="ts">
	import { MediaQuery } from 'svelte/reactivity';

	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import ORHeader from '$lib/components/ORHeader.svelte';
	import ORNavbar from '$lib/components/ORNavbar.svelte';

	let { children } = $props();

	type Layout = 'sidebar' | 'bar' | 'rail';

	// Assign layout type based on screen size using media queries
	const mediumQuery = new MediaQuery('min-width: 48rem');
	const largeQuery = new MediaQuery('min-width: 64rem');
	let layout: Layout = $derived(
		largeQuery.current ? 'sidebar' : mediumQuery.current ? 'rail' : 'bar'
	);

	const styles = {
		sidebar: {
			wrapper: 'grow grid grid-cols-[auto_1fr] items-stretch',
			nav: 'order-first'
		},
		bar: {
			wrapper: 'grow grid grid-rows-[1fr_auto]',
			nav: 'order-last'
		},
		rail: {
			wrapper: 'grow grid grid-cols-[auto_1fr]',
			nav: 'order-first'
		}
	};
	let style = $derived(styles[layout]);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="w-full h-full flex flex-col">
	<header class="flex-none">
		<ORHeader />
	</header>
	<div class={style.wrapper}>
		<nav class={style.nav}>
			<ORNavbar {layout} />
		</nav>
		<main class="mx-auto w-full p-4">
			{@render children()}
		</main>
	</div>
</div>
