<script lang="ts">
  import * as Tooltip from '$lib/components/ui/tooltip';
  import { useConnection } from '$lib/db/connection.svelte';

  const { connection } = useConnection();

  const color = $derived.by(() => {
    if (connection.status === 'CLOSED') {
      return 'bg-red-600';
    }
    if (connection.status === 'CONNECTING') {
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
      <p class="capitalize">{connection.status.toLocaleLowerCase()}</p>
    </Tooltip.Content>
  </Tooltip.Root>
</Tooltip.Provider>
