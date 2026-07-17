<script lang="ts">
	import { resolve } from '$app/paths';
	import { difficulties, formatTag } from '$lib/drills/config';
	import { labelPlayers } from '$lib/drills/filter';
	import Pill from './Pill.svelte';
	import type { Drill } from '$lib/drills';

	let { drill }: { drill: Drill } = $props();
</script>

<a class="drill-card" href={resolve('/drills/[slug]', { slug: drill.slug })}>
	<div class="drill-card-heading">
		<h3 class="drill-card-title">{drill.title}</h3>
		<svg
			class="drill-card-arrow"
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2.5"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<path d="M5 12h14" />
			<path d="m13 6 6 6-6 6" />
		</svg>
	</div>
	<p class="drill-card-summary">{drill.summary}</p>
	<div class="drill-card-pills">
		<Pill color="gray">Players: {labelPlayers(drill)}</Pill>
		{#each drill.difficulties as difficulty (difficulty)}
			<Pill color="green">{difficulties[difficulty]}</Pill>
		{/each}
		{#if drill.durationMinutes}
			<Pill color="gray">Time: {drill.durationMinutes} min</Pill>
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
		border-radius: 8px;
		text-decoration: none;
		min-height: 100%;
		transition:
			transform 150ms ease,
			background 150ms ease,
			box-shadow 150ms ease;
	}

	.drill-card:hover,
	.drill-card:focus-visible {
		background: var(--blue-light);
		box-shadow: 0 10px 28px rgba(15, 27, 45, 0.1);
		transform: translateY(-2px);
	}

	.drill-card:focus-visible {
		outline: 3px solid rgba(0, 85, 165, 0.28);
		outline-offset: 3px;
	}

	.drill-card-heading {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 12px;
	}

	.drill-card-title {
		font-size: 1.1rem;
	}

	.drill-card-arrow {
		color: var(--blue);
		font-weight: 700;
		opacity: 0;
		transform: translateX(-4px);
		transition:
			opacity 150ms ease,
			transform 150ms ease;
	}

	.drill-card:hover .drill-card-arrow,
	.drill-card:focus-visible .drill-card-arrow {
		opacity: 1;
		transform: translateX(0);
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
