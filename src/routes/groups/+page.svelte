<script lang="ts">
    import { toggleMode } from 'mode-watcher';
    import { Sun, Moon, Plus, Search } from 'lucide-svelte';
    import { Button } from '$lib/components/ui/button';
    import { Input } from '$lib/components/ui/input';

    let { data } = $props();
</script>

<div class="flex min-h-screen flex-col gap-6 p-6">
    <div id="groups-header" class="flex flex-col gap-6">
        <div class="flew-row flex gap-4">
            <div class="flex flex-1 flex-col">
                <div class="pb-2">
                    <h1 class="text-3xl font-semibold">My groups</h1>
                </div>
                <div>
                    <p class="text-l tracking-tight text-muted-foreground">
                        Manage your shared expenses
                    </p>
                </div>
            </div>
            <div class="content-center">
                <Button href="/groups/create"><Plus /> New group</Button>
            </div>
        </div>
        <div class="flex flex-row gap-4">
            <Button onclick={toggleMode} variant="outline" size="icon">
                <Sun
                    class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
                />
                <Moon
                    class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
                />
                <span class="sr-only">Toggle theme</span>
            </Button>
            <div class="relative flex-1">
                <Search
                    class="absolute left-2 top-[50%] h-4 w-4 translate-y-[-50%] text-muted-foreground"
                />
                <Input placeholder="Filter groups" class="pl-8" />
            </div>
        </div>
    </div>
    <div id="groups-content" class="flex-1">
        <form class="flex w-full max-w-sm items-center space-x-2" method="POST">
            <Input type="text" name="name" />
            <Button type="submit">Add group</Button>
        </form>

        <ul>
            {#each data.groups as group}
                <li>{group.uuid}: {group.name}</li>
            {/each}
        </ul>
    </div>
</div>
