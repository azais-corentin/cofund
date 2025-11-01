<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import Breadcrumbs from '$lib/components/shared/breadcrumbs.svelte';
  import ConnectionStatus from '$lib/components/shared/connection-status.svelte';
  import { Button } from '$shadcn/button';
  import { Plus, Trash } from '@lucide/svelte';

  interface Props {
    class?: string;
  }

  let { class: className = '' }: Props = $props();

  const isGroupPage = $derived(page.route.id === '/(app)/groups/[id]');
  const isCreateGroupPage = $derived(page.route.id === '/(app)/groups/new');

  const deleteGroup = async () => {
    if (!page.params.id) {
      return;
    }

    // TODO Delete on PouchDB

    await goto('/groups');
  };
</script>

<header class="sticky top-0 w-full px-6 {className}">
  <div class="flex h-16 flex-row items-center gap-2">
    <ConnectionStatus />
    <Breadcrumbs class="flex-1" />
    <div class="flex gap-4">
      {#if isGroupPage}
        <Button variant="destructive" onclick={deleteGroup}><Trash /> Delete group</Button>
      {/if}
      {#if !isCreateGroupPage}
        <Button href="/groups/create"><Plus /> New group</Button>
      {/if}
    </div>
  </div>
</header>
