<script lang="ts">
	import { getOneRepo } from '$lib/api/github';
    import type { PageData } from './$types';
    
    export let data: PageData;

    $: repoResult = getOneRepo({
        owner: data.owner,
        name: data.name
    });
</script>

{#if $repoResult.isLoading}
    <p>Loading...</p>
{:else if $repoResult.error}
    <p>Error: {$repoResult.error}</p>
{:else}
    {#if $repoResult.data}
        <h1>{$repoResult.data.name}</h1>
        <p>{$repoResult.data.description}</p>
    {:else}
        <p>Repo not found</p>
    {/if}
{/if}