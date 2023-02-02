<script lang="ts" context="module">
	const icons = {
		arrowLeft: {
			box: 24,
			svg: `<g><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></g>`,
			alt: 'arrow left'
		},

		arrowRight: {
			box: 24,
			svg: `<g><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></g>`,
			alt: 'arrow right'
		},

		fork: {
			box: 24,
			svg: `<g><line x1="6" y1="3" x2="6" y2="15"></line><circle cx="18" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M18 9a9 9 0 0 1-9 9"></path></g>`,
			alt: 'fork'
		},

		github: {
			box: 24,
			svg: `<g><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></g>`,
			alt: 'github'
		},

		globe: {
			box: 24,
			svg: `<g><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></g>`,
			alt: 'globe'
		},

		magnifyingGlass: {
			box: 24,
			svg: `<g><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></g>`,
			alt: 'magnifying glass'
		},

		maximize: {
			box: 24,
			svg: `<g><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></g>`,
			alt: 'maximize'
		},

		star: {
			box: 24,
			svg: `<g><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></g>`,
			alt: 'star'
		},

		warning: {
			box: 24,
			svg: `<g><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></g>`,
			alt: 'warning'
		}
	};

	export type IconName = keyof typeof icons;
</script>

<script lang="ts">
	export let name: IconName;
	export let size = 20;
	export let color = 'currentColor';
</script>

<svg
	width={size}
	height={size}
	viewBox={`0 0 ${icons[name].box} ${icons[name].box}`}
	fill="none"
	stroke={color}
	stroke-width="3"
	stroke-linecap="round"
	stroke-linejoin="round"
>
	{@html icons[name].svg}
</svg>
