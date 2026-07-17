<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { ageGroups, difficulties, equipment, skillFocuses } from '$lib/drills/config';
	import { labelPlayers } from '$lib/drills/filter';
	import Pill from '$lib/components/Pill.svelte';

	let { data } = $props();
	const drill = $derived(data.drill);
	const Content = $derived(drill.component);
	let copied = $state(false);
	const backHref = $derived.by(() => {
		if (!browser) return resolve('/search');
		const from = $page.url.searchParams.get('from');
		return from?.startsWith('/search') ? from : resolve('/search');
	});

	const copyLink = async () => {
		await navigator.clipboard.writeText(window.location.href);
		copied = true;
		window.setTimeout(() => (copied = false), 1400);
	};
</script>

<svelte:head>
	<title>{drill.title} | Tweeners</title>
	<meta name="description" content={drill.summary} />
</svelte:head>

<main class="drill-page">
	<div class="drill-header">
		<div class="container">
			<a class="back-link" href={backHref}>Back to search</a>
			<h1 class="drill-title" style={`view-transition-name: title-${drill.slug}`}>
				{drill.title}
			</h1>
			<p class="drill-summary">{drill.summary}</p>
		</div>
	</div>

	<div class="drill-content container">
		<section class="at-a-glance" aria-label="At a glance">
			<div>
				<span>Players</span>
				<strong>{labelPlayers(drill)}</strong>
			</div>
			{#if drill.durationMinutes}
				<div>
					<span>Time</span>
					<strong>{drill.durationMinutes} min</strong>
				</div>
			{/if}
			{#if drill.coaches}
				<div>
					<span>Coaches</span>
					<strong>{drill.coaches}+</strong>
				</div>
			{/if}
			<div>
				<span>Difficulty</span>
				<strong>{difficulties[drill.difficulties[0]]}</strong>
			</div>
		</section>

		<nav class="drill-jump-nav" aria-label="Drill sections">
			{#if drill.goals.length > 0}
				<a href="#goals">Goals</a>
			{/if}
			{#if drill.instructions.length > 0}
				<a href="#instructions">Instructions</a>
			{/if}
			{#if drill.variations.length > 0}
				<a href="#variations">Variations</a>
			{/if}
			{#if drill.safetyNotes.length > 0}
				<a href="#safety">Safety</a>
			{/if}
		</nav>

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
			<section class="drill-section" id="goals">
				<h2>Goals</h2>
				<ul>
					{#each drill.goals as goal (goal)}
						<li>{goal}</li>
					{/each}
				</ul>
			</section>
		{/if}

		{#if drill.instructions.length > 0}
			<section class="drill-section drill-instructions" id="instructions">
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
			<section class="drill-section" id="variations">
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
			<section class="drill-section drill-safety" id="safety">
				<h2>Safety</h2>
				<ul>
					{#each drill.safetyNotes as note (note)}
						<li>{note}</li>
					{/each}
				</ul>
			</section>
		{/if}

		<div class="drill-actions">
			<a class="drill-action-link" href={backHref}>Back</a>
			<button type="button" onclick={copyLink}>{copied ? 'Copied' : 'Copy link'}</button>
			<button type="button" onclick={() => window.print()}>Print</button>
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
		gap: 6px;
		color: rgba(255, 255, 255, 0.7);
		font-size: 0.85rem;
		font-weight: 600;
		text-decoration: none;
		margin-bottom: 20px;
		transition: color 150ms ease;
	}

	.back-link::before {
		content: '';
		width: 8px;
		height: 8px;
		border-left: 2px solid currentColor;
		border-bottom: 2px solid currentColor;
		transform: rotate(45deg);
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

	.at-a-glance {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1px;
		overflow: hidden;
		margin-bottom: 20px;
		border-radius: 8px;
		background: #dfe7ee;
	}

	.at-a-glance div {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-height: 72px;
		padding: 14px;
		background: var(--white);
	}

	.at-a-glance span {
		color: var(--muted);
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.at-a-glance strong {
		color: var(--ink);
		font-size: 0.95rem;
		line-height: 1.25;
	}

	.drill-jump-nav {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-bottom: 20px;
	}

	.drill-jump-nav a {
		display: inline-flex;
		align-items: center;
		min-height: 34px;
		padding: 6px 12px;
		border-radius: 999px;
		background: var(--off-white);
		color: var(--muted);
		font-size: 0.82rem;
		font-weight: 700;
		transition:
			background 150ms ease,
			color 150ms ease,
			transform 120ms ease;
	}

	.drill-jump-nav a:hover {
		background: var(--blue-light);
		color: var(--blue);
		transform: translateY(-1px);
	}

	.drill-pills {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-bottom: 32px;
	}

	.drill-section {
		margin-bottom: 32px;
		scroll-margin-top: 88px;
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

	.drill-instructions ol {
		padding-left: 0;
		list-style: none;
		counter-reset: instruction;
	}

	.drill-instructions li {
		display: grid;
		grid-template-columns: 32px 1fr;
		gap: 12px;
		align-items: start;
		counter-increment: instruction;
		color: var(--ink);
	}

	.drill-instructions li::before {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		border-radius: 999px;
		background: var(--green-light);
		color: var(--pill-green-text);
		font-size: 0.82rem;
		font-weight: 800;
		content: counter(instruction);
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
		border-left: 4px solid var(--yellow);
		border-radius: 8px;
	}

	.drill-safety h2 {
		color: var(--pill-yellow-text);
	}

	.drill-safety ul {
		color: var(--pill-yellow-text);
	}

	.drill-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-top: 24px;
	}

	.drill-actions button,
	.drill-action-link {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 38px;
		padding: 8px 16px;
		border: none;
		border-radius: 999px;
		background: var(--off-white);
		color: var(--muted);
		font-size: 0.84rem;
		font-weight: 600;
		cursor: pointer;
		transition:
			background 150ms ease,
			color 150ms ease,
			transform 120ms ease;
	}

	.drill-actions button:hover,
	.drill-action-link:hover {
		background: var(--blue-light);
		color: var(--blue);
		transform: translateY(-1px);
	}

	.drill-actions button:active,
	.drill-action-link:active {
		transform: scale(0.98);
	}

	@media (min-width: 760px) {
		.drill-header {
			padding: 40px 0 48px;
		}

		.variations-grid {
			grid-template-columns: repeat(2, 1fr);
		}

		.at-a-glance {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}

	@media (max-width: 759px) {
		.drill-content {
			padding-bottom: 112px;
		}

		.drill-actions {
			position: fixed;
			right: 0;
			bottom: 0;
			left: 0;
			z-index: 80;
			justify-content: center;
			margin: 0;
			padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
			background: rgba(255, 255, 255, 0.94);
			box-shadow: 0 -8px 24px rgba(15, 27, 45, 0.1);
			backdrop-filter: blur(12px);
		}
	}

	@media print {
		.drill-header {
			background: none;
			color: var(--ink);
			padding: 0;
		}

		.back-link,
		.drill-actions,
		.drill-jump-nav {
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
