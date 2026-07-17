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
</script>

<form class="search-bar" onsubmit={handleSubmit}>
	<svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
		<circle cx="11" cy="11" r="8" />
		<path d="m21 21-4.3-4.3" />
	</svg>
	<input
		bind:value
		type="search"
		{placeholder}
		class="search-input"
		aria-label="Search drills"
	/>
</form>

<style>
	.search-bar {
		display: flex;
		align-items: center;
		gap: 12px;
		background: var(--white);
		border-radius: 16px;
		padding: 14px 20px;
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
	}

	.search-input::placeholder {
		color: var(--muted);
	}
</style>
