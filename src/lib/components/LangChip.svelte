<script lang="ts">
	export let label: string;
	export let title: string | undefined = undefined;
</script>

<li class="chip" {title}>
	{label}
</li>

<style lang="scss">
	.chip {
		border-radius: 9999px;
		display: inline-block;
		font-size: small;
		font-weight: bold;
		font-family: var(--font-mono);
		text-shadow: 1px 1px 1px black;
		padding: 0.3rem 0.4rem;
		background-color: var(--bg-color, var(--primary-color));
		color: var(--text-color, var(--on-primary-color));
	}
</style>
