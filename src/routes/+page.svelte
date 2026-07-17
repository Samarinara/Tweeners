<script lang="ts">
	import { resolve } from '$app/paths';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import CourtIllustration from '$lib/components/CourtIllustration.svelte';
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
	<section class="hero">
		<div class="hero-content container">
			<p class="hero-eyebrow">Tweeners</p>
			<h1 class="hero-title">Find the right drill before the next ball rolls out.</h1>
			<p class="hero-subtitle">
				A searchable library of tennis coaching drills for club and school coaches who need
				practical options courtside.
			</p>
			<div class="hero-search">
				<SearchBar bind:value={query} {placeholder} onsubmit={handleSearch} />
			</div>
		</div>
		<div class="hero-court" aria-hidden="true">
			<CourtIllustration />
		</div>
	</section>

	<section class="features">
		<div class="container">
			<div class="features-grid">
				<div class="feature-card feature-card--blue">
					<h2>Browse the library</h2>
					<p>
						Every drill is one file with validated metadata. Search by skill, age,
						difficulty, or equipment to find exactly what you need.
					</p>
				</div>
				<div class="feature-card feature-card--green">
					<h2>Filter what matters</h2>
					<p>
						Narrow down by player count, coaching focus, and available equipment.
						No more scrolling through irrelevant results.
					</p>
				</div>
				<div class="feature-card feature-card--yellow">
					<h2>Plan your session</h2>
					<p>
						Pick drills, adapt variations, and print a clean page for court-side
						use. Everything stays shareable and searchable.
					</p>
				</div>
			</div>
		</div>
	</section>

	<section class="cta">
		<div class="container cta-inner">
			<h2>Ready to find a drill?</h2>
			<a class="cta-button" href={resolve('/search')}>Search the library</a>
		</div>
	</section>
</main>

<style>
	.hero {
		background: var(--blue);
		color: var(--white);
		padding: 64px 0 48px;
		overflow: hidden;
	}

	.hero-content {
		display: grid;
		gap: 16px;
	}

	.hero-eyebrow {
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		opacity: 0.7;
	}

	.hero-title {
		font-size: clamp(2rem, 5vw, 3.5rem);
		max-width: 640px;
	}

	.hero-subtitle {
		font-size: 1.1rem;
		max-width: 520px;
		opacity: 0.85;
		line-height: 1.55;
	}

	.hero-search {
		max-width: 520px;
		margin-top: 8px;
	}

	.hero-court {
		display: flex;
		justify-content: center;
		margin-top: 40px;
		opacity: 0.25;
	}

	.features {
		padding: 64px 0;
	}

	.features-grid {
		display: grid;
		gap: 16px;
	}

	.feature-card {
		padding: 28px 24px;
		border-radius: 16px;
		color: var(--white);
	}

	.feature-card h2 {
		font-size: 1.25rem;
		margin-bottom: 8px;
	}

	.feature-card p {
		font-size: 0.95rem;
		line-height: 1.55;
		opacity: 0.9;
	}

	.feature-card--blue {
		background: var(--blue);
	}

	.feature-card--green {
		background: var(--green);
	}

	.feature-card--yellow {
		background: var(--yellow);
		color: var(--ink);
	}

	.feature-card--yellow p {
		opacity: 0.8;
	}

	.cta {
		padding: 48px 0 80px;
	}

	.cta-inner {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 20px;
		text-align: center;
	}

	.cta h2 {
		font-size: clamp(1.5rem, 3vw, 2.2rem);
	}

	.cta-button {
		display: inline-flex;
		align-items: center;
		padding: 14px 28px;
		background: var(--blue);
		color: var(--white);
		border-radius: 12px;
		font-size: 1rem;
		font-weight: 700;
		text-decoration: none;
		transition: background 150ms ease;
	}

	.cta-button:hover {
		background: #004a92;
	}

	@media (min-width: 760px) {
		.hero {
			display: grid;
			grid-template-columns: 1fr 1fr;
			align-items: center;
			gap: 40px;
			padding: 80px 0 64px;
		}

		.hero-content {
			max-width: 600px;
		}

		.hero-court {
			margin-top: 0;
			justify-content: flex-end;
		}

		.features-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}
</style>
