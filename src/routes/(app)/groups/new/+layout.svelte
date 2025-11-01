<script lang="ts">
  import { setBreadcrumb } from '$lib/components/shared/breadcrumb-state.svelte';

  let { children } = $props();

  setBreadcrumb({ name: 'New group', path: '/groups/new' });
</script>

{@render children()}
