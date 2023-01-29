<script lang="ts">
	import type { User } from '../stores/authStore';

	export let { picture, username }: User = {
		picture: '',
		username: ''
	};
</script>

{#if picture && username}
	<span>{username}</span>
	<img class="avatar" src={picture} alt={username} height="32" />
{/if}

<style lang="scss">
	.avatar {
		border-radius: 50%;
	}
</style>
