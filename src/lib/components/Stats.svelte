<script lang="ts">
	export let stars: number;
	export let forks: number;
	export let issues: number;

	function formatBigNumber(num: number) {
		if (num < 1000) return num.toString();

		return `${Math.floor(num / 1000)}K`;
	}
</script>

<div class="stats">
	<div class="stat stars" title="Stars">
		<iconify-icon icon="ic:round-star" height="20" />
		{formatBigNumber(stars)}
	</div>

	<div class="stat forks" title="Forks">
		<iconify-icon icon="gg:git-fork" height="20" />
		{formatBigNumber(forks)}
	</div>

	<div class="stat issues" title="Issues">
		<iconify-icon icon="mdi:git-issue" style="color: black; font-size: 20px;" />
		{formatBigNumber(issues)}
	</div>
</div>

<style lang="scss">
	.stats {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.stat {
		padding: 0.2rem 0.4rem;
		display: flex;
		align-items: center;
		gap: 0.2rem;

		font-size: 1rem;
		font-family: var(--font-sans);
		font-weight: 700;

		border-radius: 9999px;
	}

	.stars {
		background-color: var(--yellow);
		border: 2px solid black;
	}

	.forks {
		background-color: var(--blue);
		border: 2px solid black;
	}

	.issues {
		background-color: var(--red);
		border: 2px solid black;
	}
</style>
