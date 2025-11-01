<script lang="ts">
  import { setBreadcrumb } from '$lib/components/shared/breadcrumb-state.svelte';

  let { children } = $props();

  setBreadcrumb({ name: 'Cofund', path: '/groups' });
</script>

{@render children()}
