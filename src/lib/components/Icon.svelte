<script lang="ts" context="module">
	const icons = {
		arrowLeft: {
			box: 24,
			svg: `<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></g>`,
			alt: 'arrow left'
		},

		arrowRight: {
			box: 24,
			svg: `<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></g>`,
			alt: 'arrow right'
		},

		bigOctopus: {
			box: 24,
			svg: ``, // TODO
			alt: 'big octopus'
		},

		continue: {
			box: 24,
			svg: ``, // TODO
			alt: 'continue'
		},

		fork: {
			box: 24,
			svg: ``, // TODO
			alt: 'fork'
		},

		github: {
			box: 24,
			svg: `<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></g>`,
			alt: 'github'
		},

		globe: {
			box: 24,
			svg: `<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></g>`,
			alt: 'globe'
		},

		magnifyingGlass: {
			box: 24,
			svg: ``, // TODO
			alt: 'magnifying glass'
		},

		maximize: {
			box: 24,
			svg: `<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></g>`,
			alt: 'maximize'
		},

		star: {
			box: 24,
			svg: ``, // TODO
			alt: 'star'
		},

		tinyOctopus: {
			box: 24,
			svg: ``, // TODO
			alt: 'tiny octopus'
		},

		warning: {
			box: 24,
			svg: ``, // TODO
			alt: 'warning'
		}
	};

	export type IconName = keyof typeof icons;
</script>

<script lang="ts">
	export let name: IconName;
	export let size = 20;
</script>

<svg width={size} height={size} viewBox={`0 0 ${icons[name].box} ${icons[name].box}`}>
	{@html icons[name].svg}
</svg>
