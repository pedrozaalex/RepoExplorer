<script lang="ts">
	import { getColorForLanguage, lightenHSL } from '@pedrozaalex/colors';

	export let lang: string;
	export let title: string | undefined = undefined;
	$: bgColor = getColorForLanguage(lang);
	$: textColor = lightenHSL(bgColor);
</script>

<li class="chip" {title} style:background-color={bgColor} style:color={textColor}>
	{lang}
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
	}
</style>
