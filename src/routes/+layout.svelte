<script lang="ts">
    import { page } from '$app/state';
    import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
    import { Button } from '$lib/components/ui/button';
    import { Input } from '$lib/components/ui/input';
    import { Moon, Plus, Search, Sun } from 'lucide-svelte';
    import { ModeWatcher } from 'mode-watcher';
    import { toggleMode } from 'mode-watcher';

    import '../app.css';

    let { children } = $props();
</script>

<ModeWatcher />

<div class="min-h-screen">
    <div class="flex min-h-screen flex-col gap-6 p-6">
        <div class="flew-row flex gap-4">
            <div class="flex flex-1 flex-col">
                <div class="pb-2">
                    <Breadcrumb.Root>
                        <Breadcrumb.List class="text-3xl font-semibold">
                            {#each page.data.navigationData as navigationData, i}
                                {#if i > 0}
                                    <Breadcrumb.Separator />
                                {/if}
                                <Breadcrumb.Item>
                                    <Breadcrumb.Link href={navigationData.url}
                                        >{navigationData.title}</Breadcrumb.Link
                                    >
                                </Breadcrumb.Item>
                            {/each}
                        </Breadcrumb.List>
                    </Breadcrumb.Root>
                </div>
                <div>
                    <p class="text-l tracking-tight text-muted-foreground">
                        {page.data.navigationData.at(-1).description}
                    </p>
                </div>
            </div>
            <div class="content-center">
                <Button href="/groups/create"><Plus /> New group</Button>
            </div>
        </div>
        {@render children()}
    </div>
</div>
