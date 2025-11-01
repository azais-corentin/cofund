<script lang="ts">
  import { page } from '$app/state';
  import { setBreadcrumb } from '$lib/components/shared/breadcrumb-state.svelte';

  let { children } = $props();

  setBreadcrumb({ name: 'New expense', path: `/groups/${page.params.id}/new` });
</script>

{@render children()}
