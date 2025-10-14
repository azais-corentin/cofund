<script lang="ts">
  import { page } from '$app/state';

  import Breadcrumbs from '$lib/breadcrumbs.svelte';
  import ConnectionStatus from '$lib/connection-status.svelte';

  import { Button } from '$lib/components/ui/button';
  import { Plus, Trash } from '@lucide/svelte';

  import { goto } from '$app/navigation';
  import { store } from '$lib/db/db';

  const isGroupPage = $derived(page.route.id === '/groups/[id]');
  const isCreateGroupPage = $derived(page.route.id === '/groups/create');

  const deleteGroup = async () => {
    if (!page.params.id) {
      return;
    }

    store.delRow('groups', page.params.id);
    goto('/groups');
  };
</script>

<header class="sticky top-0 w-full px-6">
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
