<script lang="ts">
	import { MessagesSquareIcon, UsersIcon, CircleUserIcon } from '@lucide/svelte';
	import { Navigation } from '@skeletonlabs/skeleton-svelte';

	type Layout = 'sidebar' | 'bar' | 'rail';
	let { layout = 'sidebar' as Layout } = $props();

	const styles = {
		sidebar: {
			root: 'grid grid-rows-[auto_1fr_auto] gap-4',
			menu: '',
			icon: 'size-4'
		},
		bar: {
			root: '',
			menu: 'grid grid-cols-3 gap-2',
			icon: 'size-5'
		},
		rail: {
			root: '',
			menu: '',
			icon: 'size-5'
		}
	};
	const style = $derived(styles[layout]);

	const links = [
		{ label: 'Chat', href: '/', icon: MessagesSquareIcon },
		{ label: 'Profiles', href: '/profile', icon: UsersIcon },
		{ label: 'Account', href: '/account', icon: CircleUserIcon }
	];
</script>

<Navigation {layout} class={style.root}>
	<Navigation.Menu class={style.menu}>
		{#each links as link (link)}
			{@const Icon = link.icon}
			<Navigation.TriggerAnchor href={link.href}>
				<Icon class={style.icon} />
				<Navigation.TriggerText>{link.label}</Navigation.TriggerText>
			</Navigation.TriggerAnchor>
		{/each}
	</Navigation.Menu>
</Navigation>
