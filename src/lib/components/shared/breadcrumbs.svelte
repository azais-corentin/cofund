<script lang="ts">
  import { page } from '$app/state';
  import * as Breadcrumb from '$shadcn/breadcrumb';

  let props = $props();

  interface BreadcrumbItem {
    name: string;
    path: string;
  }

  const breadcrumbs: BreadcrumbItem[] = $derived(page.data.breadcrumbs);
</script>

<Breadcrumb.Root {...props}>
  <Breadcrumb.List class="text-3xl font-semibold">
    {#each breadcrumbs as breadcrumb, index (breadcrumb.path)}
      {@const path = breadcrumbs.slice(0, index).reduce((acc, curr) => acc + '/' + curr.path, '')
        + '/' + breadcrumb.path}
      <Breadcrumb.Item>
        {#if breadcrumb.path}
          <Breadcrumb.Link href={path}>
            {breadcrumb.name}
          </Breadcrumb.Link>
          {#if index < breadcrumbs.length - 1}
            <Breadcrumb.Separator />
          {/if}
        {:else}
          <Breadcrumb.Page>
            {breadcrumb.name}
          </Breadcrumb.Page>
        {/if}
      </Breadcrumb.Item>
    {/each}
  </Breadcrumb.List>
</Breadcrumb.Root>
