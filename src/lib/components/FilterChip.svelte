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

<button
	class="chip"
	class:chip--active={active}
	type="button"
	{onclick}
>
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
		transition: background 150ms ease, color 150ms ease;
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
</style>
