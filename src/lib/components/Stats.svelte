<script lang="ts">
	import { assets } from '../../assets';
	import type { StandardRepo } from './Repo.svelte';

	export let stars: StandardRepo['stars'];
	export let forks: StandardRepo['forks'];
	export let issues: StandardRepo['issues'];

	function formatBigNumber(num: number) {
		if (num < 1000) return num.toString();

		return `${Math.floor(num / 1000)}K`;
	}
</script>

<div class="stats">
	<div class="stat stars">
		<img src={assets.star} alt="star" height="14" />
		{formatBigNumber(stars)}
	</div>

	<div class="stat forks">
		<img src={assets.fork} alt="fork" height="14" />
		{formatBigNumber(forks)}
	</div>

	<div class="stat issues">
		<img src={assets.warning} alt="issue" height="14" />
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
		font-family: var(--font-mono);
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
