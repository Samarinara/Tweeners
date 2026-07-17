<script lang="ts">
	import { ageGroups, difficulties, equipment, skillFocuses } from '$lib/drills/config';
	import { labelPlayers } from '$lib/drills/filter';

	let { data } = $props();
	const drill = $derived(data.drill);
	const Content = $derived(drill.component);
</script>

<svelte:head>
	<title>{drill.title} | Tweeners</title>
	<meta name="description" content={drill.summary} />
</svelte:head>

<main class="drill-page">
	<a class="back-link" href="/">Back to drill finder</a>

	<header class="drill-hero">
		<div>
			<p class="eyebrow">Tennis drill</p>
			<h1>{drill.title}</h1>
			<p>{drill.summary}</p>
		</div>
		<div class="quick-card">
			<span>{labelPlayers(drill)} players</span>
			<span>{drill.durationMinutes ?? 'Flexible'} min</span>
			<span>{drill.coaches ?? 1}+ coach</span>
		</div>
	</header>

	<section class="meta-grid" aria-label="Drill details">
		<div>
			<h2>Difficulty</h2>
			<p>{drill.difficulties.map((difficulty) => difficulties[difficulty]).join(', ')}</p>
		</div>
		<div>
			<h2>Ages</h2>
			<p>{drill.ages.map((age) => ageGroups[age]).join(', ')}</p>
		</div>
		<div>
			<h2>Skills</h2>
			<p>{drill.skillFocus.map((skill) => skillFocuses[skill]).join(', ')}</p>
		</div>
		<div>
			<h2>Equipment</h2>
			<p>{drill.equipment.map((item) => equipment[item]).join(', ') || 'None listed'}</p>
		</div>
	</section>

	<section class="print-panel">
		<div>
			<h2>Goals</h2>
			<ul>
				{#each drill.goals as goal}
					<li>{goal}</li>
				{/each}
			</ul>
		</div>
		<div>
			<h2>Safety</h2>
			<ul>
				{#each drill.safetyNotes as note}
					<li>{note}</li>
				{/each}
			</ul>
		</div>
	</section>

	{#if drill.instructions.length}
		<section class="print-panel">
			<h2>Instructions</h2>
			<ol>
				{#each drill.instructions as instruction}
					<li>{instruction}</li>
				{/each}
			</ol>
		</section>
	{/if}

	{#if drill.variations.length}
		<section class="variations">
			<h2>Variations</h2>
			<div class="variation-list">
				{#each drill.variations as variation}
					<article>
						<h3>{variation.title}</h3>
						{#if variation.summary}<p>{variation.summary}</p>{/if}
						{#if variation.instructions.length}
							<ul>
								{#each variation.instructions as instruction}
									<li>{instruction}</li>
								{/each}
							</ul>
						{/if}
					</article>
				{/each}
			</div>
		</section>
	{/if}

	<article class="drill-body">
		<Content />
	</article>

	<button class="print-button" type="button" onclick={() => window.print()}>Print compact version</button>
</main>
