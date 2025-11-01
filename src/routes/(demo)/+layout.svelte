<script lang="ts">
  import '../../app.css';

  import { dev } from '$app/environment';
  import SiteFooter from '$lib/components/desktop/footer.svelte';
  import Button from '$shadcn/button/button.svelte';
  import { ModeWatcher } from 'mode-watcher';

  let { children } = $props();

  let debugLayout = $state(false);

  function toggleDebugLayout() {
    debugLayout = !debugLayout;
  }
</script>

<ModeWatcher />

<div class="relative flex min-h-svh flex-col bg-background" class:debug-layout={debugLayout}>
  <main class="flex-1 px-6">
    {@render children()}
  </main>
  <SiteFooter />
</div>

{#if dev}
  <Button
    variant="outline"
    size="sm"
    onclick={toggleDebugLayout}
    class="fixed bottom-4 right-4 z-50 shadow-lg"
    title="Toggle debug layout mode"
  >
    {debugLayout ? '🔍 Debug ON' : '🔍 Debug OFF'}
  </Button>
{/if}
