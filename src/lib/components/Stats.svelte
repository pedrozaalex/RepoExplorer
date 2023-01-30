<script lang="ts">
	import { assets } from '../../assets';

	export let stars: number;
	export let forks: number;
	export let issues: number;

	function formatBigNumber(num: number) {
		if (num < 1000) return num.toString();

		return `${Math.floor(num / 1000)}K`;
	}

	function gradeStat(type: 'stars' | 'forks' | 'issues', value: number) {
		if (type === 'stars') {
			if (value < 100) return 'low';
			if (value < 1000) return 'medium';
			return 'high';
		}

		if (type === 'forks') {
			if (value < 10) return 'low';
			if (value < 100) return 'medium';
			return 'high';
		}

		if (type === 'issues') {
			if (value < 10) return 'low';
			if (value < 100) return 'medium';
			return 'high';
		}
	}
</script>

<div class="stats">
	<div class="stat stars" title="Stars">
		<img src={assets.star} alt="star" height="14" />
		{formatBigNumber(stars)}
	</div>

	<div class="stat forks" title="Forks">
		<img src={assets.fork} alt="fork" height="14" />
		{formatBigNumber(forks)}
	</div>

	<div class="stat issues" title="Issues">
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
