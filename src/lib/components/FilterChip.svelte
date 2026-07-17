<script lang="ts">
	let {
		active = false,
		onclick,
		children
	}: {
		active?: boolean;
		onclick?: () => void;
		children: any;
	} = $props();
</script>

<button class="chip" class:chip--active={active} type="button" aria-pressed={active} {onclick}>
	{#if active}
		<span class="chip-check" aria-hidden="true"></span>
	{/if}
	{@render children()}
</button>

<style>
	.chip {
		display: inline-flex;
		align-items: center;
		border: none;
		border-radius: 999px;
		padding: 6px 14px;
		background: var(--white);
		color: var(--ink);
		font-size: 0.84rem;
		font-weight: 600;
		cursor: pointer;
		min-height: 36px;
		transition:
			background 150ms ease,
			color 150ms ease,
			transform 120ms ease;
	}

	.chip:hover {
		background: var(--green-light);
	}

	.chip--active {
		background: var(--green);
		color: var(--white);
	}

	.chip--active:hover {
		background: #009447;
	}

	.chip:active {
		transform: scale(0.98);
	}

	.chip:focus-visible {
		outline: 3px solid rgba(0, 85, 165, 0.28);
		outline-offset: 2px;
	}

	.chip-check {
		width: 5px;
		height: 9px;
		margin-right: 4px;
		border-right: 2px solid currentColor;
		border-bottom: 2px solid currentColor;
		transform: translateY(-1px) rotate(45deg);
	}
</style>
