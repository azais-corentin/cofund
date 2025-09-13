<script lang="ts">
  import { getBreadcrumbs } from './breadcrumb-state.svelte';
  import * as Breadcrumb from '$lib/components/ui/breadcrumb';
</script>

<Breadcrumb.Root>
  <Breadcrumb.List class="text-3xl font-semibold">
    {#each getBreadcrumbs() as item (item.path)}
      <Breadcrumb.Item>
        {#if item.path}
          <Breadcrumb.Link
            href={item.path}
            class="max-w-20 truncate md:max-w-none"
          >
            {item.name}
          </Breadcrumb.Link>
          <Breadcrumb.Separator />
        {:else}
          <Breadcrumb.Page class="max-w-20 truncate md:max-w-none">
            {item.name}
          </Breadcrumb.Page>
        {/if}
      </Breadcrumb.Item>
    {/each}
  </Breadcrumb.List>
</Breadcrumb.Root>
