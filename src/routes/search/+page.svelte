<script lang="ts">
	import {
		ageGroups,
		difficulties,
		equipment,
		skillFocuses,
		type AgeGroup,
		type Difficulty,
		type Equipment,
		type SkillFocus
	} from '$lib/drills/config';
	import { labelPlayers, matchesDrill, sortDrills, type DrillFilters } from '$lib/drills/filter';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import DrillCard from '$lib/components/DrillCard.svelte';
	import FilterChip from '$lib/components/FilterChip.svelte';
	import FilterSection from '$lib/components/FilterSection.svelte';
	import { SvelteURLSearchParams } from 'svelte/reactivity';

	let { data } = $props();

	const searchParams =
		typeof window === 'undefined'
			? new URLSearchParams()
			: new URLSearchParams(window.location.search);

	let query = $state(searchParams.get('q') ?? '');
	let selectedDifficulties = $state<Difficulty[]>(
		searchParams.getAll('difficulty') as Difficulty[]
	);
	let selectedAges = $state<AgeGroup[]>(searchParams.getAll('age') as AgeGroup[]);
	let selectedSkills = $state<SkillFocus[]>(searchParams.getAll('skill') as SkillFocus[]);
	let selectedEquipment = $state<Equipment[]>(
		searchParams.getAll('equipment') as Equipment[]
	);
	let playerCount = $state(searchParams.get('players') ?? '');
	let sort = $state<DrillFilters['sort']>(
		(searchParams.get('sort') as DrillFilters['sort']) ?? 'title'
	);

	let showMoreFilters = $state(false);

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

	const activeFilterCount = $derived(
		selectedDifficulties.length +
			selectedAges.length +
			selectedSkills.length +
			selectedEquipment.length +
			(playerCount ? 1 : 0)
	);

	const randomDrill = () => {
		const pool = filteredDrills.length ? filteredDrills : data.drills;
		const drill = pool[Math.floor(Math.random() * pool.length)];
		if (drill) window.location.href = `/drills/${drill.slug}`;
	};

	$effect(updateUrl);
</script>

<svelte:head>
	<title>Search drills | Tweeners</title>
	<meta
		name="description"
		content="Search and filter tennis coaching drills by difficulty, age, skill, and equipment."
	/>
</svelte:head>

<main class="search-page">
	<section class="search-section">
		<div class="container">
			<h1 class="search-heading">Search drills</h1>

			<div class="search-bar-row">
				<div class="search-bar-wrapper">
					<SearchBar bind:value={query} placeholder="Rally, footwork, consistency..." />
				</div>
			</div>

			<div class="filters">
				<div class="filters-primary">
					<FilterChip active={selectedDifficulties.length > 0} onclick={() => {}}>
						Difficulty{selectedDifficulties.length ? ` (${selectedDifficulties.length})` : ''}
					</FilterChip>
					<label class="player-input">
						<span class="sr-only">Players</span>
						<input
							bind:value={playerCount}
							min="1"
							type="number"
							placeholder="Any #"
							class="player-count-input"
						/>
					</label>
					<label class="sort-select">
						<span class="sr-only">Sort</span>
						<select bind:value={sort} class="sort-input">
							<option value="title">Title</option>
							<option value="difficulty">Easiest first</option>
							<option value="players">Fewest players</option>
						</select>
					</label>
					<button
						class="more-filters-btn"
						type="button"
						onclick={() => (showMoreFilters = !showMoreFilters)}
					>
						More filters
						{#if activeFilterCount > 0}
							<span class="filter-count-badge">{activeFilterCount}</span>
						{/if}
					</button>
				</div>

				{#if showMoreFilters}
					<div class="filters-expanded">
						<FilterSection label="Difficulty" expanded={true} count={selectedDifficulties.length}>
							{#each Object.entries(difficulties) as [value, label] (value)}
								<FilterChip
									active={selectedDifficulties.includes(value as Difficulty)}
									onclick={() =>
										(selectedDifficulties = toggle(selectedDifficulties, value as Difficulty))}
								>
									{label}
								</FilterChip>
							{/each}
						</FilterSection>

						<FilterSection label="Age group" expanded={true} count={selectedAges.length}>
							{#each Object.entries(ageGroups) as [value, label] (value)}
								<FilterChip
									active={selectedAges.includes(value as AgeGroup)}
									onclick={() => (selectedAges = toggle(selectedAges, value as AgeGroup))}
								>
									{label}
								</FilterChip>
							{/each}
						</FilterSection>

						<FilterSection label="Skill focus" expanded={true} count={selectedSkills.length}>
							{#each Object.entries(skillFocuses) as [value, label] (value)}
								<FilterChip
									active={selectedSkills.includes(value as SkillFocus)}
									onclick={() => (selectedSkills = toggle(selectedSkills, value as SkillFocus))}
								>
									{label}
								</FilterChip>
							{/each}
						</FilterSection>

						<FilterSection label="Equipment" expanded={true} count={selectedEquipment.length}>
							{#each Object.entries(equipment) as [value, label] (value)}
								<FilterChip
									active={selectedEquipment.includes(value as Equipment)}
									onclick={() =>
										(selectedEquipment = toggle(selectedEquipment, value as Equipment))}
								>
									{label}
								</FilterChip>
							{/each}
						</FilterSection>
					</div>
				{/if}
			</div>
		</div>
	</section>

	<section class="results-section" aria-label="Matching drills">
		<div class="container">
			<div class="results-header">
				<h2>{filteredDrills.length} drill{filteredDrills.length !== 1 ? 's' : ''}</h2>
				<button type="button" onclick={randomDrill} class="random-btn">Random drill</button>
			</div>

			<div class="drill-grid">
				{#each filteredDrills as drill (drill.slug)}
					<DrillCard {drill} />
				{/each}
			</div>

			{#if filteredDrills.length === 0}
				<div class="no-results">
					<p>No drills match your filters.</p>
					<button
						type="button"
						onclick={() => {
							query = '';
							selectedDifficulties = [];
							selectedAges = [];
							selectedSkills = [];
							selectedEquipment = [];
							playerCount = '';
						}}
					>
						Clear all filters
					</button>
				</div>
			{/if}
		</div>
	</section>
</main>

<style>
	.search-page {
		min-height: 100vh;
	}

	.search-section {
		background: var(--white);
		padding: 32px 0 24px;
		position: sticky;
		top: 56px;
		z-index: 50;
	}

	.search-heading {
		font-size: 1.5rem;
		margin-bottom: 16px;
	}

	.search-bar-row {
		max-width: 600px;
	}

	.search-bar-wrapper {
		width: 100%;
	}

	.filters {
		margin-top: 16px;
	}

	.filters-primary {
		display: flex;
		align-items: center;
		gap: 10px;
		flex-wrap: wrap;
	}

	.player-input {
		display: contents;
	}

	.player-count-input {
		width: 80px;
		padding: 6px 12px;
		border: none;
		border-radius: 999px;
		background: var(--off-white);
		color: var(--ink);
		font-size: 0.84rem;
		font-weight: 600;
		text-align: center;
	}

	.player-count-input::placeholder {
		color: var(--muted);
	}

	.sort-select {
		display: contents;
	}

	.sort-input {
		padding: 6px 12px;
		border: none;
		border-radius: 999px;
		background: var(--off-white);
		color: var(--ink);
		font-size: 0.84rem;
		font-weight: 600;
	}

	.more-filters-btn {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 6px 14px;
		border: none;
		border-radius: 999px;
		background: var(--off-white);
		color: var(--muted);
		font-size: 0.84rem;
		font-weight: 600;
		cursor: pointer;
		transition:
			background 150ms ease,
			color 150ms ease;
	}

	.more-filters-btn:hover {
		background: var(--blue-light);
		color: var(--blue);
	}

	.filter-count-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 18px;
		height: 18px;
		padding: 0 5px;
		border-radius: 999px;
		background: var(--blue);
		color: var(--white);
		font-size: 0.7rem;
		font-weight: 700;
	}

	.filters-expanded {
		margin-top: 16px;
		display: grid;
		gap: 0;
	}

	.results-section {
		padding: 32px 0 80px;
	}

	.results-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 20px;
	}

	.results-header h2 {
		font-size: 1.1rem;
		color: var(--muted);
		font-weight: 600;
	}

	.random-btn {
		padding: 8px 16px;
		border: none;
		border-radius: 999px;
		background: var(--green);
		color: var(--white);
		font-size: 0.84rem;
		font-weight: 700;
		cursor: pointer;
		transition: background 150ms ease;
	}

	.random-btn:hover {
		background: #009447;
	}

	.drill-grid {
		display: grid;
		gap: 12px;
	}

	.no-results {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		padding: 48px 0;
		color: var(--muted);
		text-align: center;
	}

	.no-results button {
		padding: 8px 16px;
		border: none;
		border-radius: 999px;
		background: var(--blue);
		color: var(--white);
		font-size: 0.84rem;
		font-weight: 700;
		cursor: pointer;
	}

	@media (min-width: 760px) {
		.search-section {
			padding: 40px 0 28px;
		}

		.search-heading {
			font-size: 1.8rem;
		}

		.drill-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 1080px) {
		.drill-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}
</style>
