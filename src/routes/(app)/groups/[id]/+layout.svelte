<script lang="ts">
  import { page } from '$app/state';
  import { setBreadcrumb } from '$lib/components/shared/breadcrumb-state.svelte';
  import { Group } from '$lib/db/schema';
  import { CoState } from 'jazz-tools/svelte';

  let { children } = $props();

  const group = new CoState(Group, page.params.id, {
    resolve: true,
  });

  $effect(() => {
    setBreadcrumb({ name: group.current?.name ?? 'Loading', path: `/groups/${page.params.id}` });
  });
</script>

{@render children()}
