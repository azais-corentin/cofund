<script lang="ts">
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  import { getContext } from 'svelte';

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
