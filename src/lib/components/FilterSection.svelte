<script lang="ts">
	let {
		label,
		expanded = $bindable(false),
		count,
		children
	}: {
		label: string;
		expanded?: boolean;
		count?: number;
		children: any;
	} = $props();
</script>

<div class="filter-section">
	<button
		class="filter-section-toggle"
		type="button"
		onclick={() => (expanded = !expanded)}
		aria-expanded={expanded}
	>
		<span>{label}</span>
		{#if count !== undefined && count > 0}
			<span class="filter-section-count">{count}</span>
		{/if}
		<svg
			class="filter-section-chevron"
			class:open={expanded}
			width="16"
			height="16"
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
	{#if expanded}
		<div class="filter-section-content">
			{@render children()}
		</div>
	{/if}
</div>

<style>
	.filter-section {
		border-bottom: 1px solid #e5e7eb;
	}

	.filter-section-toggle {
		display: flex;
		align-items: center;
		gap: 8px;
		width: 100%;
		padding: 14px 0;
		background: none;
		border: none;
		color: var(--ink);
		font-size: 0.9rem;
		font-weight: 700;
		text-align: left;
		cursor: pointer;
	}

	.filter-section-toggle:hover {
		color: var(--blue);
	}

	.filter-section-count {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 20px;
		height: 20px;
		padding: 0 6px;
		border-radius: 999px;
		background: var(--blue);
		color: var(--white);
		font-size: 0.72rem;
		font-weight: 700;
		animation: badge-pop 180ms ease;
	}

	.filter-section-chevron {
		margin-left: auto;
		transition: transform 200ms ease;
	}

	.filter-section-chevron.open {
		transform: rotate(180deg);
	}

	.filter-section-content {
		padding-bottom: 16px;
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		animation: reveal-filters 180ms ease;
		transform-origin: top;
	}

	@keyframes reveal-filters {
		from {
			opacity: 0;
			transform: translateY(-4px) scaleY(0.98);
		}
		to {
			opacity: 1;
			transform: translateY(0) scaleY(1);
		}
	}

	@keyframes badge-pop {
		50% {
			transform: scale(1.12);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.filter-section-content,
		.filter-section-count {
			animation: none;
		}
	}
</style>
