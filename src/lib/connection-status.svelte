<script lang="ts">
  import * as Tooltip from '$lib/components/ui/tooltip';
  import { connectionStatus } from '$lib/db/hooks.svelte';

  const color = $derived.by(() => {
    if (connectionStatus.state === 'CLOSED') {
      return 'bg-red-600';
    }
    if (connectionStatus.state === 'CONNECTING') {
      return 'bg-yellow-600';
    }

    return 'bg-green-600';
  });
</script>

<Tooltip.Provider delayDuration={0}>
  <Tooltip.Root>
    <Tooltip.Trigger>
      <div class="inline-block h-3 w-3 rounded-full {color}"></div>
    </Tooltip.Trigger>
    <Tooltip.Content>
      <p class="capitalize">{connectionStatus.state.toLocaleLowerCase()}</p>
    </Tooltip.Content>
  </Tooltip.Root>
</Tooltip.Provider>
