<script lang="ts">
	import { formatDistance } from 'date-fns';

	type Repo = {
		url: string;
		fullName: string;
		description: string;
		stars: number;
		forks: number;
		issues: number;
		lastUpdated: string;
		license: string;
	};

	export let data: Repo;

	$: formattedDate = formatDistance(new Date(data.lastUpdated), new Date(), {
		addSuffix: true
	});
</script>

<div>
	<a href={data.url} target="_blank" rel="noreferrer">
		<h2>{data.fullName}</h2>
	</a>

	<p>{data.description}</p>

	<div>
		<p>{data.stars} ⭐</p>
		<p>{data.forks} 🍴</p>
		<p>{data.issues} ❓</p>
		<p>Last updated {formattedDate}</p>
		<p>{data.license}</p>
	</div>
</div>
