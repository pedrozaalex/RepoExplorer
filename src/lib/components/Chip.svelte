<script lang="ts">
	export let label: string;
	export let title: string | undefined = undefined;
</script>

<div class="chip" {title}>
	<p>{label}</p>
</div>

<style lang="scss">
	.chip {
		border-radius: 9999px;
		display: inline-block;
		font-size: small;
		padding: 0.3rem 0.4rem;
		background-color: var(--bg-color, var(--primary-color));
		color: var(--text-color, var(--on-primary-color));
	}
</style>
