<script lang="ts">
	import { resolve } from '$app/paths';
	import { difficulties, formatTag } from '$lib/drills/config';
	import { labelPlayers } from '$lib/drills/filter';
	import Pill from './Pill.svelte';
	import type { Drill } from '$lib/drills';

	let { drill }: { drill: Drill } = $props();
</script>

<a class="drill-card" href={resolve('/drills/[slug]', { slug: drill.slug })}>
	<h3 class="drill-card-title">{drill.title}</h3>
	<p class="drill-card-summary">{drill.summary}</p>
	<div class="drill-card-pills">
		<Pill color="gray">{labelPlayers(drill)} players</Pill>
		{#each drill.difficulties as difficulty (difficulty)}
			<Pill color="green">{difficulties[difficulty]}</Pill>
		{/each}
		{#if drill.durationMinutes}
			<Pill color="gray">{drill.durationMinutes} min</Pill>
		{/if}
	</div>
	{#if drill.tags.length > 0}
		<div class="drill-card-tags">
			{#each drill.tags.slice(0, 4) as tag (tag)}
				<span class="drill-card-tag">{formatTag(tag)}</span>
			{/each}
		</div>
	{/if}
</a>

<style>
	.drill-card {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 20px;
		background: var(--white);
		border-radius: 12px;
		text-decoration: none;
		transition: transform 150ms ease, background 150ms ease;
	}

	.drill-card:hover {
		background: var(--blue-light);
	}

	.drill-card-title {
		font-size: 1.1rem;
	}

	.drill-card-summary {
		color: var(--muted);
		font-size: 0.9rem;
		line-height: 1.5;
	}

	.drill-card-pills {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}

	.drill-card-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}

	.drill-card-tag {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--muted);
	}
</style>
