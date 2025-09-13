<script lang="ts">
  import { page } from '$app/state';
  import { setBreadcrumb } from '$lib/breadcrumb-state.svelte';

  import { useQueryOne } from '@triplit/svelte';
  import { db, Query } from '$lib/db/db';
  import { setContext } from 'svelte';

  let { children } = $props();

  const groupQuery = useQueryOne(
    db,
    Query('groups').Where('id', '=', page.params.id),
  );

  setContext('groupQuery', groupQuery);

  $effect(() => {
    setBreadcrumb({
      name: groupQuery.result?.name ?? '?',
      path: `/groups/${page.params.id}`,
    });
  });
</script>

{@render children()}
