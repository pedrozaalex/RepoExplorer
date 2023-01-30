<script lang="ts">
	export let label: string;
</script>

<div class="chip">
	<p>{label}</p>
</div>

<style lang="scss">
	.chip {
		border-radius: 9999px;
		display: inline-block;
		font-size: small;
		padding: 0.3rem 0.4rem;
		background-color: var(--bg-color, var(--primary-color));
		$color: var(--text-color, var(--on-primary-color));
		color: $color;
		// border: $color 2px solid;
	}
</style>
