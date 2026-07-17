<script lang="ts">
	let {
		color = 'gray',
		children
	}: {
		color?: 'blue' | 'green' | 'yellow' | 'gray';
		children: any;
	} = $props();
</script>

<span class="pill pill--{color}">
	{@render children()}
</span>
