<script lang="ts">
  import { setBreadcrumb } from '$lib/breadcrumb-state.svelte';

  let { children } = $props();

  setBreadcrumb({ name: 'Cofund', path: '/groups' });
</script>

{@render children()}
