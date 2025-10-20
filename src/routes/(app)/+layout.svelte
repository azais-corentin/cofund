<script lang="ts">
  import favicon from '$lib/assets/favicon.svg';
  import { pwaAssetsHead } from 'virtual:pwa-assets/head';
  import { pwaInfo } from 'virtual:pwa-info';
  import '../../app.css';

  import { dev } from '$app/environment';
  import SiteFooter from '$lib/components/site-footer.svelte';
  import SiteHeader from '$lib/components/site-header.svelte';
  import Button from '$lib/components/ui/button/button.svelte';
  import { ModeWatcher } from 'mode-watcher';

  const webManifest = $derived(pwaInfo ? pwaInfo.webManifest.linkTag : '');

  let { children } = $props();

  let debugLayout = $state(false);

  function toggleDebugLayout() {
    debugLayout = !debugLayout;
  }
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

<div class="relative flex min-h-svh flex-col bg-background" class:debug-layout={debugLayout}>
  <div class="hidden md:block">
    <SiteHeader />
  </div>

  <main class="flex-1 px-6 pt-4 md:pt-0">
    {@render children()}
  </main>

  <div class="hidden md:block">
    <SiteFooter />
  </div>
</div>

<!-- Debug Layout Toggle Button - Only shown in development -->
{#if dev}
  <Button
    variant="outline"
    size="sm"
    onclick={toggleDebugLayout}
    class="fixed bottom-4 left-4 z-50 shadow-lg"
    title="Toggle debug layout mode"
  >
    {debugLayout ? '🔍 Debug ON' : '🔍 Debug OFF'}
  </Button>
{/if}

{#await import('$lib/ReloadPrompt.svelte') then { default: ReloadPrompt }}
  <ReloadPrompt />
{/await}
