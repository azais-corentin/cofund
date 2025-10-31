<script lang="ts">
  import { Button } from '$lib/components/shadcn/button/index.js';
  import * as Command from '$lib/components/shadcn/command/index.js';
  import * as Popover from '$lib/components/shadcn/popover/index.js';
  import { cn } from '$lib/utils.js';
  import { Check, ChevronsUpDown } from '@lucide/svelte';

  let {
    symbols = [],
    value = $bindable(''),
    placeholder = 'Select currency...',
    disabled = false,
    ...restProps
  }: {
    symbols: string[];
    value: string;
    placeholder?: string;
    disabled?: boolean;
    [key: string]: any;
  } = $props();

  let open = $state(false);

  const handleSelect = (symbol: string) => {
    value = symbol;
    open = false;
  };
</script>

<Popover.Root bind:open>
  <Popover.Trigger>
    {#snippet child({ props })}
      <Button
        {...props}
        {...restProps}
        type="button"
        variant="outline"
        role="combobox"
        aria-expanded={open}
        {disabled}
        class={cn('w-full justify-between', !value && 'text-muted-foreground', restProps.class)}
      >
        {value || placeholder}
        <ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
      </Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content class="w-[200px] p-0" align="start">
    <Command.Root>
      <Command.Input placeholder="Search currency..." />
      <Command.List>
        <Command.Empty>No currency found.</Command.Empty>
        <Command.Group>
          {#each symbols as symbol (symbol)}
            {@const isSelected = value === symbol}
            <Command.Item value={symbol} onSelect={() => handleSelect(symbol)}>
              <Check class={cn('mr-2 size-4', isSelected ? 'opacity-100' : 'opacity-0')} />
              {symbol}
            </Command.Item>
          {/each}
        </Command.Group>
      </Command.List>
    </Command.Root>
  </Popover.Content>
</Popover.Root>
