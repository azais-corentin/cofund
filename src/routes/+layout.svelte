<script lang="ts">
  import '../app.css';
  import favicon from '$lib/assets/favicon.svg';
  import { pwaAssetsHead } from 'virtual:pwa-assets/head';
  import { pwaInfo } from 'virtual:pwa-info';
  import { page } from '$app/state';
  import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
  import { Button } from '$lib/components/ui/button';
  import { Plus } from '@lucide/svelte';
  import { ModeWatcher } from 'mode-watcher';
  import Breadcrumbs from '$lib/breadcrumbs.svelte';
  import ConnectionStatus from '$lib/connection-status.svelte';

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

<div class="min-h-screen">
  <div class="flex min-h-screen flex-col gap-6 p-6">
    <div class="flex flex-row gap-4 pb-2">
      <div class="flex flex-1 flex-col">
        <div class="flex items-center gap-2">
          <ConnectionStatus />
          <Breadcrumbs />
        </div>
      </div>
      <div class="content-center">
        <Button href="/groups/create"><Plus /> New group</Button>
      </div>
    </div>
    {@render children()}
  </div>
</div>

{#await import('$lib/ReloadPrompt.svelte') then { default: ReloadPrompt }}
  <ReloadPrompt />
{/await}
