<script lang="ts">
  import { setBreadcrumb } from '$lib/breadcrumb-state.svelte';

  let { children } = $props();

  setBreadcrumb({ name: 'New expense', path: '' });
</script>

{@render children()}
