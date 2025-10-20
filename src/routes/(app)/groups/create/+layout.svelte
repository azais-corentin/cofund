<script lang="ts">
  import { setBreadcrumb } from '$lib/breadcrumb-state.svelte';

  let { children } = $props();

  setBreadcrumb({ name: 'New group', path: '/groups/create' });
</script>

{@render children()}
