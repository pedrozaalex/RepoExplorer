<script lang="ts">
	export let owner: string;
	export let name: string;
	export let stars: number;
	export let forks: number;
	export let issues: number;

	function formatBigNumber(num: number) {
		if (num < 1000) return num.toString();

		return `${Math.floor(num / 1000)}K`;
	}
</script>

<div class="stats">
	<a
		class="stat"
		title="Stars"
		href="https://github.com/{owner}/{name}/stargazers"
		target="_blank"
		rel="noopener noreferrer"
	>
		<iconify-icon icon="ic:round-star" height="20" />
		{formatBigNumber(stars)}
	</a>

	<a
		class="stat"
		title="Forks"
		href="https://github.com/{owner}/{name}/network/members"
		target="_blank"
		rel="noopener noreferrer"
	>
		<iconify-icon icon="gg:git-fork" height="20" />
		{formatBigNumber(forks)}
	</a>

	<a
		class="stat"
		title="Issues"
		href="https://github.com/{owner}/{name}/issues"
		target="_blank"
		rel="noopener noreferrer"
	>
		<iconify-icon icon="mdi:git-issue" style="color: black; font-size: 20px;" />
		{formatBigNumber(issues)}
	</a>
</div>

<style lang="scss">
	.stats {
		display: flex;
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
</style>
