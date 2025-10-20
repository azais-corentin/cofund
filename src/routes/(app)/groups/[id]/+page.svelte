<script lang="ts">
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  import { getContext } from 'svelte';
  import { Button } from '$lib/components/ui/button';
  import { Plus } from '@lucide/svelte';

  dayjs.extend(relativeTime);

  const groupQuery: any = getContext('groupQuery');
  const group = $derived(groupQuery?.result);
</script>

<!-- {data.group?.name} -->
<p>
  Group name: {group?.name ?? 'loading group name'}
</p>

<p>
  Created {dayjs().to(group?.created_at)}
</p>

<p>Users:</p>
<ul class="ml-6 list-disc">
  {#if groupQuery.fetching}
    <p>Loading...</p>
  {:else if groupQuery.error}
    <p>Error: {groupQuery.error.message}</p>
  {:else if group}
    {#each group.users ?? [] as user (user)}
      <li class="mt-2">{user}</li>
    {/each}
  {/if}
</ul>

<!-- Spacer for floating button -->
<div class="h-24"></div>

<!-- Floating action button -->
<div class="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-background to-transparent pt-10 pb-5 px-5 flex justify-end pointer-events-none md:hidden">
  <a href="/groups/{group?.id}/new" class="pointer-events-auto">
    <Button
      size="lg"
      class="h-14 px-5 gap-4 pl-4 pr-6 shadow-lg bg-[oklch(0.646_0.222_41.116)] hover:bg-[oklch(0.646_0.222_41.116)]/90 text-white"
    >
      <Plus class="size-6" />
      <span class="truncate">Add Expense</span>
    </Button>
  </a>
</div>

<!-- Desktop "Add Expense" button -->
<div class="hidden md:flex justify-start mt-6">
  <a href="/groups/{group?.id}/new">
    <Button size="lg" class="gap-2">
      <Plus class="size-5" />
      <span>Add Expense</span>
    </Button>
  </a>
</div>
