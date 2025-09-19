<script lang="ts">
  import '../app.css';
  import { pwaAssetsHead } from 'virtual:pwa-assets/head';
  import { pwaInfo } from 'virtual:pwa-info';
  import favicon from '$lib/assets/favicon.svg';

  import { page } from '$app/state';

  import { ModeWatcher } from 'mode-watcher';
  import { Plus, Trash } from '@lucide/svelte';

  import { Button } from '$lib/components/ui/button';
  import { db } from '$lib/db/db';
  import Breadcrumbs from '$lib/breadcrumbs.svelte';
  import ConnectionStatus from '$lib/connection-status.svelte';

  const webManifest = $derived(pwaInfo ? pwaInfo.webManifest.linkTag : '');

  let { children } = $props();

  const isGroupPage = $derived(page.route.id === '/groups/[id]');
  const isCreateGroupPage = $derived(page.route.id === '/groups/create');

  const deleteGroup = async () => {
    if (!page.params.id) {
      return;
    }

    await db.delete('groups', page.params.id);
  };
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
      <div class="flex gap-4">
        {#if isGroupPage}
          <Button variant="destructive" onclick={deleteGroup}><Trash /> Delete group</Button>
        {/if}
        {#if !isCreateGroupPage}
          <Button href="/groups/create"><Plus /> New group</Button>
        {/if}
      </div>
    </div>
    {@render children()}
  </div>
</div>

{#await import('$lib/ReloadPrompt.svelte') then { default: ReloadPrompt }}
  <ReloadPrompt />
{/await}
