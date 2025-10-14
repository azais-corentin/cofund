<script lang="ts">
  import { page } from '$app/state';
  import { setBreadcrumb } from '$lib/breadcrumb-state.svelte';

  import { useRow } from '$lib/db/hooks.svelte';
  import { deserializeGroup, type Group } from '$lib/db/schema';
  import { setContext } from 'svelte';

  let { children } = $props();

  const groupQuery = useRow<Group>('groups', page.params.id || '', deserializeGroup);

  setContext('groupQuery', groupQuery);

  $effect(() => {
    setBreadcrumb({ name: groupQuery.result?.name ?? '?', path: `/groups/${page.params.id}` });
  });
</script>

{@render children()}
