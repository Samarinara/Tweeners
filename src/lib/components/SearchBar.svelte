<script lang="ts">
	let {
		value = $bindable(''),
		placeholder = 'Search drills...',
		onsubmit
	}: {
		value?: string;
		placeholder?: string;
		onsubmit?: (query: string) => void;
	} = $props();

	const handleSubmit = (e: SubmitEvent) => {
		e.preventDefault();
		onsubmit?.(value);
	};

	const clearSearch = () => {
		value = '';
	};
</script>

<form class="search-bar" onsubmit={handleSubmit}>
	<svg
		class="search-icon"
		width="20"
		height="20"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2.5"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
	>
		<circle cx="11" cy="11" r="8" />
		<path d="m21 21-4.3-4.3" />
	</svg>
	<input bind:value type="search" {placeholder} class="search-input" aria-label="Search drills" />
	{#if value}
		<button class="search-clear" type="button" aria-label="Clear search" onclick={clearSearch}>
			<span aria-hidden="true"></span>
		</button>
	{/if}
	<button class="search-submit" type="submit" aria-label="Submit search">
		<svg
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2.5"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<path d="M5 12h14" />
			<path d="m13 6 6 6-6 6" />
		</svg>
	</button>
</form>

<style>
	.search-bar {
		display: flex;
		align-items: center;
		gap: 12px;
		background: var(--white);
		border-radius: 16px;
		padding: 10px 12px 10px 20px;
		width: 100%;
		transition: box-shadow 200ms ease;
	}

	.search-bar:focus-within {
		box-shadow: 0 0 0 3px rgba(0, 85, 165, 0.25);
	}

	.search-icon {
		flex-shrink: 0;
		color: var(--muted);
	}

	.search-input {
		flex: 1;
		border: none;
		background: transparent;
		font-size: 1.05rem;
		color: var(--ink);
		outline: none;
		padding: 0;
		min-width: 0;
	}

	.search-input::placeholder {
		color: var(--muted);
	}

	.search-clear,
	.search-submit {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		border: none;
		border-radius: 999px;
		background: transparent;
		color: var(--muted);
		transition:
			background 150ms ease,
			color 150ms ease,
			transform 120ms ease;
	}

	.search-clear span,
	.search-clear span::after {
		display: block;
		width: 14px;
		height: 2px;
		border-radius: 999px;
		background: currentColor;
		content: '';
	}

	.search-clear span {
		transform: rotate(45deg);
	}

	.search-clear span::after {
		transform: rotate(90deg);
	}

	.search-submit {
		background: var(--blue);
		color: var(--white);
		opacity: 0;
		pointer-events: none;
		transform: translateX(-4px);
	}

	.search-bar:focus-within .search-submit,
	.search-input:not(:placeholder-shown) ~ .search-submit {
		opacity: 1;
		pointer-events: auto;
		transform: translateX(0);
	}

	.search-clear:hover,
	.search-submit:hover {
		background: var(--blue-light);
		color: var(--blue);
	}

	.search-submit:hover {
		background: #00498f;
		color: var(--white);
	}

	.search-clear:active,
	.search-submit:active {
		transform: scale(0.96);
	}
</style>
