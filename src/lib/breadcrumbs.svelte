<script lang="ts">
  import { getBreadcrumbs } from './breadcrumb-state.svelte';
  import * as Breadcrumb from '$lib/components/ui/breadcrumb';

  let items = $derived(getBreadcrumbs());
</script>

<Breadcrumb.Root>
  <Breadcrumb.List class="text-3xl font-semibold">
    {#each items as item, index (item.path)}
      <Breadcrumb.Item>
        {#if item.path}
          <Breadcrumb.Link href={item.path}>
            {item.name}
          </Breadcrumb.Link>
          {#if index < items.length - 1}
            <Breadcrumb.Separator />
          {/if}
        {:else}
          <Breadcrumb.Page>
            {item.name}
          </Breadcrumb.Page>
        {/if}
      </Breadcrumb.Item>
    {/each}
  </Breadcrumb.List>
</Breadcrumb.Root>
