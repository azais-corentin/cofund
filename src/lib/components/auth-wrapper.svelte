<script lang="ts">
  import Auth from '$lib/components/auth.svelte';
  import { useIsAuthenticated } from 'jazz-tools/svelte';
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();

  const isAuthenticated = useIsAuthenticated();
</script>

{#if isAuthenticated.current}
  {@render children()}
{:else}
  <Auth />
{/if}
