<script lang="ts">
	import { resolve } from '$app/paths';

	let { currentPath = '/' }: { currentPath?: string } = $props();
</script>

<header class="header">
	<div class="header-inner container">
		<a class="header-logo" href={resolve('/')}>
			<span class="header-logo-mark" aria-hidden="true"></span>
			Tweeners
		</a>
		<nav>
			<a class="header-link" href={resolve('/search')}>Search drills</a>
		</nav>
	</div>
</header>

<style>
	.header {
		position: sticky;
		top: 0;
		z-index: 100;
		background: var(--white);
		border-bottom: 3px solid var(--blue);
	}

	.header-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 56px;
	}

	.header-logo {
		display: flex;
		align-items: center;
		gap: 8px;
		font-family: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif;
		font-size: 1.2rem;
		font-weight: 700;
		letter-spacing: -0.01em;
		text-decoration: none;
	}

	.header-logo-mark {
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: var(--yellow);
	}

	.header-link {
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--muted);
		text-decoration: none;
		transition: color 150ms ease;
	}

	.header-link:hover {
		color: var(--blue);
	}
</style>
