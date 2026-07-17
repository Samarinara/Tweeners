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
	import { onMount } from 'svelte';

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
	let selectedEquipment = $state<Equipment[]>(searchParams.getAll('equipment') as Equipment[]);
	let playerCount = $state(searchParams.get('players') ?? '');
	let sort = $state<DrillFilters['sort']>(
		(searchParams.get('sort') as DrillFilters['sort']) ?? 'title'
	);

	let showMoreFilters = $state(false);
	let isScrolled = $state(false);
	let randomizing = $state(false);

	const toggle = <T,>(values: T[], value: T) =>
		values.includes(value) ? values.filter((item) => item !== value) : [...values, value];

	const setPlayerCount = (next: number) => {
		playerCount = next > 0 ? String(next) : '';
	};

	const adjustPlayerCount = (delta: number) => {
		setPlayerCount(Math.max(0, Number(playerCount || 0) + delta));
	};

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

	const clearAllFilters = () => {
		query = '';
		selectedDifficulties = [];
		selectedAges = [];
		selectedSkills = [];
		selectedEquipment = [];
		playerCount = '';
	};

	const activeFilterLabels = $derived([
		...selectedDifficulties.map((value) => ({
			key: `difficulty-${value}`,
			label: difficulties[value],
			remove: () => (selectedDifficulties = selectedDifficulties.filter((item) => item !== value))
		})),
		...selectedAges.map((value) => ({
			key: `age-${value}`,
			label: ageGroups[value],
			remove: () => (selectedAges = selectedAges.filter((item) => item !== value))
		})),
		...selectedSkills.map((value) => ({
			key: `skill-${value}`,
			label: skillFocuses[value],
			remove: () => (selectedSkills = selectedSkills.filter((item) => item !== value))
		})),
		...selectedEquipment.map((value) => ({
			key: `equipment-${value}`,
			label: equipment[value],
			remove: () => (selectedEquipment = selectedEquipment.filter((item) => item !== value))
		})),
		...(playerCount
			? [
					{
						key: 'players',
						label: `${playerCount} player${playerCount === '1' ? '' : 's'}`,
						remove: () => (playerCount = '')
					}
				]
			: [])
	]);

	const searchSummary = $derived(
		[
			query.trim() ? `"${query.trim()}"` : '',
			...activeFilterLabels.slice(0, 2).map((filter) => filter.label)
		]
			.filter(Boolean)
			.join(' + ')
	);

	const emptySuggestion = $derived.by(() => {
		if (selectedEquipment.length) return 'Try removing equipment filters first.';
		if (selectedSkills.length) return 'Try one fewer skill focus.';
		if (playerCount) return 'Try clearing the player count.';
		if (query.trim()) return 'Try a broader search term like rally or footwork.';
		return 'Try clearing one filter to widen the drill list.';
	});

	const randomDrill = () => {
		const pool = filteredDrills.length ? filteredDrills : data.drills;
		const drill = pool[Math.floor(Math.random() * pool.length)];
		if (!drill) return;

		randomizing = true;
		window.setTimeout(() => {
			window.location.href = `/drills/${drill.slug}`;
		}, 220);
	};

	onMount(() => {
		const handleScroll = () => {
			isScrolled = window.scrollY > 4;
		};
		const handleKeydown = (event: KeyboardEvent) => {
			if (
				event.key === '/' &&
				!event.metaKey &&
				!event.ctrlKey &&
				!event.altKey &&
				document.activeElement instanceof HTMLElement &&
				!['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)
			) {
				event.preventDefault();
				document.querySelector<HTMLInputElement>('.search-input')?.focus();
			}

			if (event.key === 'Escape') {
				if (query) {
					query = '';
				} else if (showMoreFilters) {
					showMoreFilters = false;
				}
			}
		};

		handleScroll();
		window.addEventListener('scroll', handleScroll, { passive: true });
		window.addEventListener('keydown', handleKeydown);

		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('keydown', handleKeydown);
		};
	});

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
	<section class="search-section" class:scrolled={isScrolled}>
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
					<div class="player-stepper" aria-label="Players">
						<button type="button" aria-label="Decrease players" onclick={() => adjustPlayerCount(-1)}>
							-
						</button>
						<input
							bind:value={playerCount}
							min="1"
							type="number"
							placeholder="Any"
							class="player-count-input"
						/>
						<button type="button" aria-label="Increase players" onclick={() => adjustPlayerCount(1)}>
							+
						</button>
					</div>
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
						class:expanded={showMoreFilters}
						type="button"
						onclick={() => (showMoreFilters = !showMoreFilters)}
						aria-expanded={showMoreFilters}
					>
						More filters
						{#if activeFilterCount > 0}
							<span class="filter-count-badge">{activeFilterCount}</span>
						{/if}
						<svg
							class="more-filters-chevron"
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
							stroke-linecap="round"
							stroke-linejoin="round"
							aria-hidden="true"
						>
							<path d="m6 9 6 6 6-6" />
						</svg>
					</button>
				</div>

				{#if query.trim() || activeFilterLabels.length > 0}
					<div class="active-filters" aria-label="Active filters">
						{#if query.trim()}
							<button class="active-filter" type="button" onclick={() => (query = '')}>
								Search: {query.trim()}
								<span aria-hidden="true">x</span>
							</button>
						{/if}
						{#each activeFilterLabels as filter (filter.key)}
							<button class="active-filter" type="button" onclick={filter.remove}>
								{filter.label}
								<span aria-hidden="true">x</span>
							</button>
						{/each}
						<button class="clear-filters" type="button" onclick={clearAllFilters}>Clear all</button>
					</div>
				{/if}

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
				<div>
					<h2>{filteredDrills.length} drill{filteredDrills.length !== 1 ? 's' : ''}</h2>
					{#if searchSummary}
						<p class="results-summary">Showing drills for {searchSummary}</p>
					{/if}
				</div>
				<button type="button" onclick={randomDrill} class="random-btn" class:randomizing>
					{randomizing ? 'Choosing...' : 'Random drill'}
				</button>
			</div>

			<div class="drill-grid">
				{#each filteredDrills as drill (drill.slug)}
					<DrillCard {drill} highlight={query} />
				{/each}
			</div>

			{#if filteredDrills.length === 0}
				<div class="no-results">
					<p>No drills match your filters.</p>
					<p class="no-results-suggestion">{emptySuggestion}</p>
					<button
						type="button"
						onclick={clearAllFilters}
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
		transition: box-shadow 180ms ease;
	}

	.search-section.scrolled {
		box-shadow: 0 10px 26px rgba(15, 27, 45, 0.08);
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

	.player-stepper {
		display: inline-flex;
		align-items: center;
		min-height: 36px;
		overflow: hidden;
		border-radius: 999px;
		background: var(--off-white);
	}

	.player-stepper button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 34px;
		height: 36px;
		border: none;
		background: transparent;
		color: var(--muted);
		font-weight: 800;
		transition:
			background 150ms ease,
			color 150ms ease;
	}

	.player-stepper button:hover {
		background: var(--blue-light);
		color: var(--blue);
	}

	.player-count-input {
		width: 58px;
		height: 36px;
		padding: 6px 4px;
		border: none;
		background: transparent;
		color: var(--ink);
		font-size: 0.84rem;
		font-weight: 600;
		text-align: center;
		outline: none;
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
			color 150ms ease,
			transform 120ms ease;
	}

	.more-filters-btn:hover {
		background: var(--blue-light);
		color: var(--blue);
	}

	.more-filters-btn:active {
		transform: scale(0.98);
	}

	.more-filters-chevron {
		transition: transform 180ms ease;
	}

	.more-filters-btn.expanded .more-filters-chevron {
		transform: rotate(180deg);
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
		animation: filter-panel-in 180ms ease;
		transform-origin: top;
	}

	.active-filters {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-top: 14px;
	}

	.active-filter,
	.clear-filters {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		min-height: 34px;
		padding: 6px 12px;
		border: none;
		border-radius: 999px;
		font-size: 0.8rem;
		font-weight: 700;
		transition:
			background 150ms ease,
			color 150ms ease,
			transform 120ms ease;
	}

	.active-filter {
		background: var(--blue-light);
		color: var(--blue);
	}

	.active-filter span {
		font-size: 0.8rem;
		font-weight: 800;
	}

	.clear-filters {
		background: var(--off-white);
		color: var(--muted);
	}

	.active-filter:hover,
	.clear-filters:hover {
		transform: translateY(-1px);
	}

	.active-filter:active,
	.clear-filters:active {
		transform: scale(0.98);
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

	.results-summary {
		margin-top: 2px;
		color: var(--muted);
		font-size: 0.85rem;
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
		transition:
			background 150ms ease,
			transform 120ms ease;
	}

	.random-btn:hover {
		background: #009447;
	}

	.random-btn:active {
		transform: scale(0.98);
	}

	.random-btn.randomizing {
		animation: random-pulse 220ms ease infinite alternate;
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

	.no-results-suggestion {
		font-size: 0.9rem;
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

	@keyframes filter-panel-in {
		from {
			opacity: 0;
			transform: translateY(-6px) scaleY(0.98);
		}
		to {
			opacity: 1;
			transform: translateY(0) scaleY(1);
		}
	}

	@keyframes random-pulse {
		to {
			transform: translateY(-1px);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.search-section,
		.filters-expanded,
		.more-filters-chevron,
		.random-btn.randomizing {
			animation: none;
			transition: none;
		}
	}
</style>
