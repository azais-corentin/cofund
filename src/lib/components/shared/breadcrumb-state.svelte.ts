import { SvelteMap } from 'svelte/reactivity';

export interface Breadcrumb {
  path: string;
  name: string;
}

export interface BreadcrumbInternal extends Breadcrumb {
  count: number;
}

const breadcrumbMap = new SvelteMap<string, BreadcrumbInternal>();

const breadcrumbs: Breadcrumb[] = $derived.by(() => Array.from(breadcrumbMap.values()) // Array.from(breadcrumbMap.values()).toSorted((a, b) => a.count - b.count)
);
export const getBreadcrumbs = (): Breadcrumb[] => breadcrumbs;

export function setBreadcrumb(item: Breadcrumb) {
  console.info('Setting breadcrumb:', item);
  $effect(() => {
    breadcrumbMap.set(item.path, { ...item, count: item.path.split('/').length });
    return () => {
      breadcrumbMap.delete(item.path);
    };
  });
}
