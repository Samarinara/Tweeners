<script lang="ts">
	import { resolve } from '$app/paths';
	import {
		ageGroups,
		difficulties,
		equipment,
		formatTag,
		skillFocuses,
		type AgeGroup,
		type Difficulty,
		type Equipment,
		type SkillFocus
	} from '$lib/drills/config';
	import { labelPlayers, matchesDrill, sortDrills, type DrillFilters } from '$lib/drills/filter';
	import { SvelteURLSearchParams } from 'svelte/reactivity';

	let { data } = $props();

	const searchParams = new URLSearchParams(
		typeof window === 'undefined' ? '' : window.location.search
	);

	let query = $state(searchParams.get('q') ?? '');
	let selectedDifficulties = $state<Difficulty[]>(
		searchParams.getAll('difficulty') as Difficulty[]
	);
	let selectedAges = $state<AgeGroup[]>(searchParams.getAll('age') as AgeGroup[]);
	let selectedSkills = $state<SkillFocus[]>(searchParams.getAll('skill') as SkillFocus[]);
	let selectedEquipment = $state<Equipment[]>(searchParams.getAll('equipment') as Equipment[]);
	let playerCount = $state(searchParams.get('players') ?? '');
	let sort = $state<DrillFilters['sort']>(
		(searchParams.get('sort') as DrillFilters['sort']) ?? 'title'
	);

	const toggle = <T,>(values: T[], value: T) =>
		values.includes(value) ? values.filter((item) => item !== value) : [...values, value];

	const updateUrl = () => {
		if (typeof window === 'undefined') return;

		const params = new SvelteURLSearchParams();
		if (query.trim()) params.set('q', query.trim());
		selectedDifficulties.forEach((value) => params.append('difficulty', value));
		selectedAges.forEach((value) => params.append('age', value));
		selectedSkills.forEach((value) => params.append('skill', value));
		selectedEquipment.forEach((value) => params.append('equipment', value));
		if (playerCount) params.set('players', playerCount);
		if (sort !== 'title') params.set('sort', sort);

		const next = params.toString() ? `?${params}` : window.location.pathname;
		window.history.replaceState({}, '', next);
	};

	const filters = $derived<DrillFilters>({
		query,
		difficulties: selectedDifficulties,
		ages: selectedAges,
		playerCount: playerCount ? Number(playerCount) : undefined,
		skillFocus: selectedSkills,
		equipment: selectedEquipment,
		sort
	});

	const filteredDrills = $derived(
		sortDrills(
			data.drills.filter((drill) => matchesDrill(drill, filters)),
			sort
		)
	);
	const randomDrill = () => {
		const pool = filteredDrills.length ? filteredDrills : data.drills;
		const drill = pool[Math.floor(Math.random() * pool.length)];
		if (drill) window.location.href = resolve('/drills/[slug]', { slug: drill.slug });
	};

	$effect(updateUrl);
</script>

<svelte:head>
	<title>Tweeners Tennis Drill Library</title>
	<meta
		name="description"
		content="A mobile-first library of tennis coaching drills filtered by difficulty, age, players, skills, and equipment."
	/>
</svelte:head>

<main>
	<section class="finder-hero">
		<div class="finder-copy">
			<p class="eyebrow">Tweeners drill library</p>
			<h1>Find the right tennis drill before the next ball rolls out.</h1>
			<p>
				Fast, typed, mdsvex-powered drill pages for club and school coaches who need practical
				options courtside.
			</p>
		</div>

		<form class="finder" onsubmit={(event) => event.preventDefault()}>
			<label>
				<span>Search drills</span>
				<input bind:value={query} type="search" placeholder="Rally, footwork, consistency..." />
			</label>

			<div class="finder-row">
				<label>
					<span>Players</span>
					<input bind:value={playerCount} min="1" type="number" placeholder="Any" />
				</label>
				<label>
					<span>Sort</span>
					<select bind:value={sort}>
						<option value="title">Title</option>
						<option value="difficulty">Easiest first</option>
						<option value="players">Fewest players</option>
					</select>
				</label>
			</div>

			<div class="filter-block">
				<span>Difficulty</span>
				<div class="chips">
					{#each Object.entries(difficulties) as [value, label] (value)}
						<button
							class:active={selectedDifficulties.includes(value as Difficulty)}
							type="button"
							onclick={() =>
								(selectedDifficulties = toggle(selectedDifficulties, value as Difficulty))}
						>
							{label}
						</button>
					{/each}
				</div>
			</div>

			<div class="filter-block">
				<span>Age</span>
				<div class="chips compact">
					{#each Object.entries(ageGroups) as [value, label] (value)}
						<button
							class:active={selectedAges.includes(value as AgeGroup)}
							type="button"
							onclick={() => (selectedAges = toggle(selectedAges, value as AgeGroup))}
						>
							{label}
						</button>
					{/each}
				</div>
			</div>

			<div class="filter-block">
				<span>Skill focus</span>
				<div class="chips compact">
					{#each Object.entries(skillFocuses) as [value, label] (value)}
						<button
							class:active={selectedSkills.includes(value as SkillFocus)}
							type="button"
							onclick={() => (selectedSkills = toggle(selectedSkills, value as SkillFocus))}
						>
							{label}
						</button>
					{/each}
				</div>
			</div>

			<div class="filter-block">
				<span>I have</span>
				<div class="chips compact">
					{#each Object.entries(equipment) as [value, label] (value)}
						<button
							class:active={selectedEquipment.includes(value as Equipment)}
							type="button"
							onclick={() => (selectedEquipment = toggle(selectedEquipment, value as Equipment))}
						>
							{label}
						</button>
					{/each}
				</div>
			</div>
		</form>
	</section>

	<section class="results-section" aria-label="Matching drills">
		<div class="results-header">
			<h2>{filteredDrills.length} drills</h2>
			<button type="button" onclick={randomDrill}>Random drill</button>
		</div>

		<div class="drill-grid">
			{#each filteredDrills as drill (drill.slug)}
				<a class="drill-card" href={resolve('/drills/[slug]', { slug: drill.slug })}>
					<div>
						<h3>{drill.title}</h3>
						<p>{drill.summary}</p>
					</div>
					<div class="card-meta">
						<span>{labelPlayers(drill)} players</span>
						<span
							>{drill.difficulties.map((difficulty) => difficulties[difficulty]).join(', ')}</span
						>
					</div>
					<div class="tag-row">
						{#each drill.tags.slice(0, 4) as tag (tag)}
							<span>{formatTag(tag)}</span>
						{/each}
					</div>
				</a>
			{/each}
		</div>
	</section>

	<section class="pitch-section">
		<div>
			<h2>Built for quick coaching decisions.</h2>
			<p>
				Each drill is one mdsvex file with validated metadata, which means new drills can be added
				without touching the app shell. The library stays searchable, shareable, and ready for
				static deployment.
			</p>
		</div>
		<div class="court-mark" aria-hidden="true">
			<div></div>
			<div></div>
			<div></div>
		</div>
	</section>
</main>
