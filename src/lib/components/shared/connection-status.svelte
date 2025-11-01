<script lang="ts">
  import * as Tooltip from '$shadcn/tooltip';

  import { SyncConnectionStatus } from 'jazz-tools/svelte';

  const connectionStatus = new SyncConnectionStatus();
  const connected = $derived(connectionStatus.current);
</script>

<Tooltip.Provider delayDuration={0}>
  <Tooltip.Root>
    <Tooltip.Trigger>
      <div class="inline-block h-3 w-3 rounded-full {connected ? 'bg-green-600' : 'bg-yellow-600'}">
      </div>
    </Tooltip.Trigger>
    <Tooltip.Content>
      <p class="capitalize">{connected ? 'Online' : 'Offline'}</p>
    </Tooltip.Content>
  </Tooltip.Root>
</Tooltip.Provider>
