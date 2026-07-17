<script lang="ts">
	import SearchBar from '$lib/components/SearchBar.svelte';
	import { goto } from '$app/navigation';

	let { data } = $props();

	let query = $state('');

	const randomDrill = data.drills[Math.floor(Math.random() * data.drills.length)];
	const placeholder = randomDrill ? `Try "${randomDrill.title}"...` : 'Search drills...';

	const handleSearch = (q: string) => {
		const params = new URLSearchParams();
		if (q.trim()) params.set('q', q.trim());
		const url = params.toString() ? `/search?${params}` : '/search';
		goto(url);
	};
</script>

<svelte:head>
	<title>Tweeners Tennis Drill Library</title>
	<meta
		name="description"
		content="Find the right tennis drill before the next ball rolls out. A searchable library for club and school coaches."
	/>
</svelte:head>

<main>
	<div class="court" aria-hidden="true">
		<div class="court-baseline"></div>
		<div class="court-service-line"></div>
		<div class="court-center-line"></div>
		<div class="court-singles-left"></div>
		<div class="court-singles-right"></div>
		<div class="court-doubles-left"></div>
		<div class="court-doubles-right"></div>
	</div>
	<p class="eyebrow">Tweeners</p>
	<h1>Find the right drill<br />before the next ball rolls out.</h1>
	<div class="search-wrapper">
		<SearchBar bind:value={query} {placeholder} onsubmit={handleSearch} />
	</div>
	<p class="flavour">
		A searchable library of tennis coaching drills for club and school coaches who need practical
		options courtside.
	</p>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
		height: 100dvh;
		padding: 32px;
		background: var(--blue);
		color: var(--white);
		text-align: center;
		overflow: hidden;
	}

	.court {
		position: absolute;
		top: 62%;
		left: 50%;
		transform: translateX(-50%);
		width: 80vw;
		max-width: 680px;
		height: 100vh;
		background: var(--green);
		pointer-events: none;
	}

	.court-baseline {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 3px;
		background: var(--white);
	}

	.court-service-line {
		position: absolute;
		top: 55%;
		left: 0;
		right: 0;
		height: 3px;
		background: var(--white);
	}

	.court-center-line {
		position: absolute;
		top: 55%;
		left: 50%;
		width: 3px;
		bottom: 0;
		background: var(--white);
	}

	.court-singles-left {
		position: absolute;
		top: 0;
		left: 12%;
		width: 3px;
		bottom: 0;
		background: var(--white);
	}

	.court-singles-right {
		position: absolute;
		top: 0;
		right: 12%;
		width: 3px;
		bottom: 0;
		background: var(--white);
	}

	.court-doubles-left {
		position: absolute;
		top: 0;
		left: 0;
		width: 3px;
		bottom: 0;
		background: var(--white);
	}

	.court-doubles-right {
		position: absolute;
		top: 0;
		right: 0;
		width: 3px;
		bottom: 0;
		background: var(--white);
	}

	.eyebrow {
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		opacity: 0.6;
		margin-bottom: 12px;
	}

	h1 {
		font-size: clamp(1.8rem, 5vw, 3.2rem);
		max-width: 600px;
		margin-bottom: 32px;
	}

	.search-wrapper {
		width: 100%;
		max-width: 480px;
	}

	.flavour {
		margin-top: 24px;
		max-width: 400px;
		font-size: 0.95rem;
		opacity: 0.7;
		line-height: 1.55;
	}
</style>
