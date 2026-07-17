<script lang="ts">
	import { resolve } from '$app/paths';
	import { ageGroups, difficulties, equipment, skillFocuses } from '$lib/drills/config';
	import { labelPlayers } from '$lib/drills/filter';
	import Pill from '$lib/components/Pill.svelte';

	let { data } = $props();
	const drill = $derived(data.drill);
	const Content = $derived(drill.component);
</script>

<svelte:head>
	<title>{drill.title} | Tweeners</title>
	<meta name="description" content={drill.summary} />
</svelte:head>

<main class="drill-page">
	<div class="drill-header">
		<div class="container">
			<a class="back-link" href={resolve('/search')}>← Back to search</a>
			<h1 class="drill-title">{drill.title}</h1>
			<p class="drill-summary">{drill.summary}</p>
		</div>
	</div>

	<div class="container drill-content">
		<div class="drill-pills">
			{#each drill.difficulties as difficulty (difficulty)}
				<Pill color="green">{difficulties[difficulty]}</Pill>
			{/each}
			{#each drill.ages as age (age)}
				<Pill color="blue">{ageGroups[age]}</Pill>
			{/each}
			<Pill color="gray">{labelPlayers(drill)} players</Pill>
			{#if drill.durationMinutes}
				<Pill color="gray">{drill.durationMinutes} min</Pill>
			{/if}
			{#if drill.coaches}
				<Pill color="gray">{drill.coaches}+ coach{drill.coaches > 1 ? 'es' : ''}</Pill>
			{/if}
			{#each drill.skillFocus as skill (skill)}
				<Pill color="yellow">{skillFocuses[skill]}</Pill>
			{/each}
			{#each drill.equipment as item (item)}
				<Pill color="gray">{equipment[item]}</Pill>
			{/each}
		</div>

		{#if drill.goals.length > 0}
			<section class="drill-section">
				<h2>Goals</h2>
				<ul>
					{#each drill.goals as goal (goal)}
						<li>{goal}</li>
					{/each}
				</ul>
			</section>
		{/if}

		{#if drill.instructions.length > 0}
			<section class="drill-section">
				<h2>Instructions</h2>
				<ol>
					{#each drill.instructions as instruction (instruction)}
						<li>{instruction}</li>
					{/each}
				</ol>
			</section>
		{/if}

		<article class="drill-body">
			<Content />
		</article>

		{#if drill.variations.length > 0}
			<section class="drill-section">
				<h2>Variations</h2>
				<div class="variations-grid">
					{#each drill.variations as variation (variation.title)}
						<article class="variation-card">
							<h3>{variation.title}</h3>
							{#if variation.summary}
								<p>{variation.summary}</p>
							{/if}
							{#if variation.difficulties.length > 0}
								<div class="variation-pills">
									{#each variation.difficulties as difficulty (difficulty)}
										<Pill color="green">{difficulties[difficulty]}</Pill>
									{/each}
									{#each variation.ages as age (age)}
										<Pill color="blue">{ageGroups[age]}</Pill>
									{/each}
								</div>
							{/if}
							{#if variation.instructions.length > 0}
								<ul>
									{#each variation.instructions as instruction (instruction)}
										<li>{instruction}</li>
									{/each}
								</ul>
							{/if}
						</article>
					{/each}
				</div>
			</section>
		{/if}

		{#if drill.safetyNotes.length > 0}
			<section class="drill-section drill-safety">
				<h2>Safety</h2>
				<ul>
					{#each drill.safetyNotes as note (note)}
						<li>{note}</li>
					{/each}
				</ul>
			</section>
		{/if}

		<div class="drill-print">
			<button type="button" onclick={() => window.print()}>Print this drill</button>
		</div>
	</div>
</main>

<style>
	.drill-header {
		background: var(--blue);
		color: var(--white);
		padding: 24px 0 32px;
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		color: rgba(255, 255, 255, 0.7);
		font-size: 0.85rem;
		font-weight: 600;
		text-decoration: none;
		margin-bottom: 20px;
		transition: color 150ms ease;
	}

	.back-link:hover {
		color: var(--white);
	}

	.drill-title {
		font-size: clamp(1.8rem, 4vw, 2.8rem);
		margin-bottom: 8px;
	}

	.drill-summary {
		font-size: 1.05rem;
		opacity: 0.85;
		max-width: 600px;
		line-height: 1.55;
	}

	.drill-content {
		padding-top: 28px;
		padding-bottom: 80px;
	}

	.drill-pills {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-bottom: 32px;
	}

	.drill-section {
		margin-bottom: 32px;
	}

	.drill-section h2 {
		font-size: 1.25rem;
		margin-bottom: 12px;
		color: var(--ink);
	}

	.drill-section ul,
	.drill-section ol {
		margin: 0;
		padding-left: 24px;
		color: var(--muted);
		line-height: 1.7;
	}

	.drill-section li {
		margin-bottom: 6px;
	}

	.drill-body {
		margin-bottom: 32px;
		line-height: 1.7;
	}

	.drill-body :global(h2) {
		font-family: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif;
		font-size: 1.25rem;
		font-weight: 700;
		margin: 24px 0 12px;
	}

	.drill-body :global(h3) {
		font-family: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif;
		font-size: 1.1rem;
		font-weight: 600;
		margin: 20px 0 8px;
	}

	.drill-body :global(p) {
		margin-bottom: 12px;
		color: var(--muted);
	}

	.drill-body :global(ul),
	.drill-body :global(ol) {
		padding-left: 24px;
		color: var(--muted);
	}

	.drill-body :global(li) {
		margin-bottom: 6px;
	}

	.variations-grid {
		display: grid;
		gap: 12px;
	}

	.variation-card {
		padding: 20px;
		background: var(--green);
		color: var(--white);
		border-radius: 12px;
	}

	.variation-card h3 {
		font-size: 1.05rem;
		margin-bottom: 6px;
	}

	.variation-card p {
		font-size: 0.9rem;
		opacity: 0.9;
		line-height: 1.5;
		margin-bottom: 10px;
	}

	.variation-pills {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-bottom: 10px;
	}

	.variation-card .variation-pills :global(.pill) {
		background: rgba(255, 255, 255, 0.2);
		color: var(--white);
	}

	.variation-card ul {
		margin: 0;
		padding-left: 20px;
		font-size: 0.9rem;
		opacity: 0.9;
		line-height: 1.6;
	}

	.drill-safety {
		padding: 20px;
		background: var(--yellow-light);
		border-radius: 12px;
	}

	.drill-safety h2 {
		color: var(--pill-yellow-text);
	}

	.drill-safety ul {
		color: var(--pill-yellow-text);
	}

	.drill-print {
		margin-top: 24px;
	}

	.drill-print button {
		padding: 8px 16px;
		border: none;
		border-radius: 999px;
		background: var(--off-white);
		color: var(--muted);
		font-size: 0.84rem;
		font-weight: 600;
		cursor: pointer;
		transition: background 150ms ease, color 150ms ease;
	}

	.drill-print button:hover {
		background: var(--blue-light);
		color: var(--blue);
	}

	@media (min-width: 760px) {
		.drill-header {
			padding: 40px 0 48px;
		}

		.variations-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media print {
		.drill-header {
			background: none;
			color: var(--ink);
			padding: 0;
		}

		.back-link,
		.drill-print {
			display: none;
		}

		.drill-title {
			color: var(--ink);
		}

		.drill-summary {
			color: var(--muted);
			opacity: 1;
		}
	}
</style>
