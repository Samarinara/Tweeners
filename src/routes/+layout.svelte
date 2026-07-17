<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/Header.svelte';
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/stores';

	let { children } = $props();

	const isHome = $derived($page.url.pathname === '/');

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise<void>((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

{#if !isHome}
	<Header />
{/if}
{@render children()}
