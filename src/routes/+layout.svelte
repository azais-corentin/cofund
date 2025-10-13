<script lang="ts">
  import '../app.css';
  import favicon from '$lib/assets/favicon.svg';
  import { pwaAssetsHead } from 'virtual:pwa-assets/head';
  import { pwaInfo } from 'virtual:pwa-info';

  import SiteFooter from '$lib/components/site-footer.svelte';
  import SiteHeader from '$lib/components/site-header.svelte';
  import { ModeWatcher } from 'mode-watcher';

  const webManifest = $derived(pwaInfo ? pwaInfo.webManifest.linkTag : '');

  let { children } = $props();
</script>

<svelte:head>
  {#if pwaAssetsHead.themeColor}
    <meta name="theme-color" content={pwaAssetsHead.themeColor.content} />
  {/if}
  {#each pwaAssetsHead.links as link}
    <link {...link} />
  {/each}
  {@html webManifest}
  <link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher />

<div class="relative flex min-h-svh flex-col bg-background">
  <SiteHeader />
  <main class="flex-1 px-6">
    {@render children()}
  </main>
  <SiteFooter />
</div>

{#await import('$lib/ReloadPrompt.svelte') then { default: ReloadPrompt }}
  <ReloadPrompt />
{/await}
