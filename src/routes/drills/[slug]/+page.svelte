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
	const sectionLinks = $derived.by(() =>
		[
			drill.instructions.length > 0 && { href: '#instructions', label: 'Steps' },
			{ href: '#setup', label: 'Setup' },
			drill.progressions.length > 0 && { href: '#progressions', label: 'Progressions' },
			drill.variations.length > 0 && { href: '#variations', label: 'Variations' },
			drill.safetyNotes.length > 0 && { href: '#safety', label: 'Safety' }
		].filter((link): link is { href: string; label: string } => Boolean(link))
	);
	const equipmentList = $derived(drill.equipment.map((item) => equipment[item]).join(', '));
	const skillList = $derived(drill.skillFocus.map((skill) => skillFocuses[skill]).join(', '));
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
			<div class="drill-hero-grid">
				<div>
					<h1 class="drill-title" style={`view-transition-name: title-${drill.slug}`}>
						{drill.title}
					</h1>
					<p class="drill-summary">{drill.summary}</p>
				</div>
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
						<span>Level</span>
						<strong>{difficulties[drill.difficulties[0]]}</strong>
					</div>
				</section>
			</div>
		</div>
	</div>

	<div class="drill-content container">
		<nav class="drill-jump-nav" aria-label="Drill sections">
			{#each sectionLinks as link}
				<a href={link.href}>{link.label}</a>
			{/each}
		</nav>

		<div class="drill-layout">
			<aside class="drill-sidebar" aria-label="Drill quick reference">
				<div class="quick-panel">
					{#if drill.equipment.length > 0}
						<div class="quick-row">
							<span>Equipment</span>
							<strong>{equipmentList}</strong>
						</div>
					{/if}
					{#if drill.skillFocus.length > 0}
						<div class="quick-row">
							<span>Focus</span>
							<strong>{skillList}</strong>
						</div>
					{/if}
					<div class="quick-row">
						<span>Ages</span>
						<div class="quick-pills">
							{#each drill.ages as age (age)}
								<Pill color="blue">{ageGroups[age]}</Pill>
							{/each}
						</div>
					</div>
				</div>
			</aside>

			<div class="drill-main">
				{#if drill.safetyNotes.length > 0}
					<section class="safety-strip" aria-label="Safety reminder">
						<strong>Safety</strong>
						<span>{drill.safetyNotes[0]}</span>
					</section>
				{/if}

				{#if drill.goals.length > 0}
					<section class="drill-section drill-goals" id="goals">
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
						<h2>Steps</h2>
						<ol>
							{#each drill.instructions as instruction (instruction)}
								<li>{instruction}</li>
							{/each}
						</ol>
					</section>
				{/if}

				<article class="drill-body" id="setup">
					<Content />
				</article>

				{#if drill.progressions.length > 0}
					<section class="drill-section drill-progressions" id="progressions">
						<h2>Progressions</h2>
						<ul>
							{#each drill.progressions as progression (progression)}
								<li>{progression}</li>
							{/each}
						</ul>
					</section>
				{/if}

				{#if drill.variations.length > 0}
					<section class="drill-section" id="variations">
						<h2>Variations</h2>
						<div class="variations-grid">
							{#each drill.variations as variation (variation.title)}
								<details class="variation-card">
									<summary>
										<span>
											<strong>{variation.title}</strong>
											{#if variation.summary}
												<small>{variation.summary}</small>
											{/if}
										</span>
									</summary>
									{#if variation.difficulties.length > 0 || variation.ages.length > 0}
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
								</details>
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
			</div>
		</div>

		<div class="drill-actions" aria-label="Drill actions">
			<a class="drill-action-link" href={backHref} aria-label="Back to search">
				<span aria-hidden="true">Back</span>
			</a>
			<button type="button" onclick={copyLink} aria-label="Copy drill link">
				<span>{copied ? 'Copied' : 'Copy link'}</span>
			</button>
			<button type="button" onclick={() => window.print()} aria-label="Print drill">
				<span>Print</span>
			</button>
			<span class="copy-status" aria-live="polite">{copied ? 'Link copied' : ''}</span>
		</div>
	</div>
</main>

<style>
	.drill-header {
		background: var(--blue);
		color: var(--white);
		padding: 20px 0 24px;
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		color: rgba(255, 255, 255, 0.7);
		font-size: 0.85rem;
		font-weight: 600;
		text-decoration: none;
		margin-bottom: 16px;
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
		font-size: clamp(1.75rem, 4vw, 2.65rem);
		margin-bottom: 8px;
	}

	.drill-summary {
		font-size: 1rem;
		opacity: 0.85;
		max-width: 600px;
		line-height: 1.5;
	}

	.drill-content {
		padding-top: 16px;
		padding-bottom: 80px;
	}

	.drill-hero-grid {
		display: grid;
		gap: 18px;
		align-items: end;
	}

	.at-a-glance {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1px;
		overflow: hidden;
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.24);
	}

	.at-a-glance div {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-height: 64px;
		padding: 12px;
		background: rgba(255, 255, 255, 0.94);
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
		position: sticky;
		top: 59px;
		z-index: 40;
		display: flex;
		gap: 6px;
		overflow-x: auto;
		margin: 0 -16px 18px;
		padding: 10px 16px;
		background: rgba(248, 250, 249, 0.94);
		border-bottom: 1px solid rgba(90, 107, 120, 0.14);
		scrollbar-width: none;
		backdrop-filter: blur(12px);
	}

	.drill-jump-nav::-webkit-scrollbar {
		display: none;
	}

	.drill-jump-nav a {
		display: inline-flex;
		align-items: center;
		flex: 0 0 auto;
		min-height: 32px;
		padding: 6px 11px;
		border: 1px solid rgba(90, 107, 120, 0.14);
		border-radius: 999px;
		background: var(--white);
		color: var(--muted);
		font-size: 0.8rem;
		font-weight: 750;
		transition:
			border-color 150ms ease,
			background 150ms ease,
			color 150ms ease,
			transform 120ms ease;
	}

	.drill-jump-nav a:hover {
		border-color: rgba(0, 85, 165, 0.2);
		background: var(--blue-light);
		color: var(--blue);
		transform: translateY(-1px);
	}

	.drill-layout {
		display: grid;
		gap: 18px;
	}

	.drill-sidebar {
		order: -1;
	}

	.quick-panel {
		display: grid;
		gap: 1px;
		overflow: hidden;
		border: 1px solid rgba(90, 107, 120, 0.14);
		border-radius: 8px;
		background: rgba(90, 107, 120, 0.14);
	}

	.quick-row {
		display: grid;
		gap: 5px;
		padding: 12px 14px;
		background: var(--white);
	}

	.quick-row span {
		color: var(--muted);
		font-size: 0.72rem;
		font-weight: 800;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	.quick-row strong {
		color: var(--ink);
		font-size: 0.92rem;
		line-height: 1.4;
	}

	.quick-pills {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.safety-strip {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		width: 100%;
		margin-bottom: 18px;
		padding: 11px 13px;
		border: 1px solid rgba(146, 64, 14, 0.18);
		border-left: 4px solid var(--yellow);
		border-radius: 8px;
		background: var(--yellow-light);
		color: var(--pill-yellow-text);
		line-height: 1.45;
	}

	.safety-strip strong {
		flex: 0 0 auto;
		font-size: 0.76rem;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	.safety-strip span {
		font-size: 0.9rem;
	}

	.drill-goals {
		padding-bottom: 20px;
		border-bottom: 1px solid rgba(90, 107, 120, 0.12);
	}

	.drill-progressions {
		padding: 18px;
		border: 1px solid rgba(0, 166, 81, 0.16);
		border-radius: 8px;
		background: var(--green-light);
	}

	.drill-progressions h2 {
		color: var(--pill-green-text);
	}

	.drill-progressions ul {
		color: var(--pill-green-text);
	}

	.drill-progressions li::marker {
		color: var(--green);
	}

	.drill-section {
		margin-bottom: 28px;
		scroll-margin-top: 116px;
	}

	.drill-section h2 {
		font-size: 1.18rem;
		margin-bottom: 10px;
		color: var(--ink);
	}

	.drill-section ul,
	.drill-section ol {
		margin: 0;
		padding-left: 22px;
		color: var(--muted);
		line-height: 1.65;
	}

	.drill-section li {
		margin-bottom: 5px;
	}

	.drill-instructions {
		padding: 18px;
		border: 1px solid rgba(0, 85, 165, 0.12);
		border-radius: 8px;
		background: var(--white);
		box-shadow: 0 12px 28px rgba(15, 27, 45, 0.06);
	}

	.drill-instructions ol {
		padding-left: 0;
		list-style: none;
		counter-reset: instruction;
	}

	.drill-instructions li {
		display: grid;
		grid-template-columns: 30px 1fr;
		gap: 11px;
		align-items: start;
		counter-increment: instruction;
		color: var(--ink);
	}

	.drill-instructions li + li {
		margin-top: 10px;
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
		margin-bottom: 28px;
		line-height: 1.65;
		scroll-margin-top: 116px;
	}

	.drill-body :global(h2) {
		font-family: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif;
		font-size: 1.18rem;
		font-weight: 700;
		margin: 22px 0 10px;
	}

	.drill-body :global(h2:first-child) {
		margin-top: 0;
	}

	.drill-body :global(h3) {
		font-family: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif;
		font-size: 1.05rem;
		font-weight: 600;
		margin: 18px 0 8px;
	}

	.drill-body :global(p) {
		margin-bottom: 10px;
		color: var(--muted);
	}

	.drill-body :global(ul),
	.drill-body :global(ol) {
		padding-left: 22px;
		color: var(--muted);
	}

	.drill-body :global(li) {
		margin-bottom: 5px;
	}

	.variations-grid {
		display: grid;
		gap: 10px;
	}

	.variation-card {
		overflow: hidden;
		border: 1px solid rgba(90, 107, 120, 0.14);
		border-radius: 8px;
		background: var(--white);
		transition:
			border-color 150ms ease,
			box-shadow 150ms ease;
	}

	.variation-card[open] {
		border-color: rgba(0, 85, 165, 0.18);
		box-shadow: 0 12px 28px rgba(15, 27, 45, 0.06);
	}

	.variation-card summary {
		display: grid;
		grid-template-columns: 1fr 24px;
		gap: 12px;
		align-items: center;
		padding: 15px 16px;
		color: var(--ink);
		cursor: pointer;
		list-style: none;
	}

	.variation-card summary::-webkit-details-marker {
		display: none;
	}

	.variation-card summary::after {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		border: 1px solid rgba(90, 107, 120, 0.16);
		border-radius: 999px;
		color: var(--muted);
		content: '+';
		font-weight: 800;
		line-height: 1;
		transition:
			background 150ms ease,
			color 150ms ease,
			transform 150ms ease;
	}

	.variation-card[open] summary::after {
		background: var(--blue-light);
		color: var(--blue);
		content: '-';
		transform: rotate(180deg);
	}

	.variation-card summary strong {
		display: block;
		margin-bottom: 3px;
		font-family: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif;
		font-size: 1rem;
	}

	.variation-card summary small {
		display: block;
		color: var(--muted);
		font-size: 0.88rem;
		font-weight: 500;
		line-height: 1.45;
	}

	.variation-pills {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		padding: 0 16px 10px;
	}

	.variation-card ul {
		margin: 0;
		padding: 0 16px 16px 36px;
		color: var(--muted);
		font-size: 0.9rem;
		line-height: 1.55;
	}

	.variation-card li {
		margin-bottom: 5px;
	}

	.drill-safety {
		padding: 18px;
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
		gap: 8px;
		margin-top: 24px;
	}

	.drill-actions button,
	.drill-action-link {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 94px;
		min-height: 38px;
		padding: 8px 14px;
		border: none;
		border-radius: 999px;
		background: var(--white);
		color: var(--muted);
		font-size: 0.84rem;
		font-weight: 700;
		cursor: pointer;
		box-shadow: inset 0 0 0 1px rgba(90, 107, 120, 0.14);
		transition:
			background 150ms ease,
			box-shadow 150ms ease,
			color 150ms ease,
			transform 120ms ease;
	}

	.drill-actions button:hover,
	.drill-action-link:hover {
		background: var(--blue-light);
		color: var(--blue);
		box-shadow: inset 0 0 0 1px rgba(0, 85, 165, 0.18);
		transform: translateY(-1px);
	}

	.drill-actions button:active,
	.drill-action-link:active {
		transform: scale(0.98);
	}

	.copy-status {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	@media (prefers-reduced-motion: no-preference) {
		:global(html) {
			scroll-behavior: smooth;
		}
	}

	@media (min-width: 760px) {
		.drill-header {
			padding: 28px 0 34px;
		}

		.drill-hero-grid {
			grid-template-columns: minmax(0, 1fr) minmax(360px, 430px);
		}

		.at-a-glance {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.drill-content {
			padding-top: 0;
		}

		.drill-jump-nav {
			top: 59px;
			margin-right: 0;
			margin-left: 0;
			padding-right: 0;
			padding-left: 0;
		}

		.drill-layout {
			grid-template-columns: minmax(0, 1fr) 280px;
			align-items: start;
		}

		.drill-main {
			min-width: 0;
		}

		.drill-sidebar {
			position: sticky;
			top: 122px;
			order: 1;
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
			padding: 10px 12px calc(10px + env(safe-area-inset-bottom));
			background: rgba(255, 255, 255, 0.94);
			box-shadow: 0 -8px 24px rgba(15, 27, 45, 0.1);
			backdrop-filter: blur(12px);
		}

		.drill-actions button,
		.drill-action-link {
			flex: 1 1 0;
			min-width: 0;
			max-width: 120px;
			padding-right: 10px;
			padding-left: 10px;
		}

		.safety-strip {
			align-items: flex-start;
			flex-direction: column;
			gap: 4px;
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
		.drill-jump-nav,
		.drill-sidebar {
			display: none;
		}

		.drill-layout {
			display: block;
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
