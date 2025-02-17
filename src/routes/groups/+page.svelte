<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import { Input } from '$lib/components/ui/input';
    import { observeLive } from '$lib/db/live.js';
    import { type Groups } from '$lib/db/types.js';
    import { type Selectable } from 'kysely';
    import { Moon, Plus, Search, Sun, Trash2 } from 'lucide-svelte';
    import { toggleMode } from 'mode-watcher';

    let { data } = $props();

    let groups = $state(data.groups);

    type Group = Selectable<Groups>;

    observeLive<Group>('groups', groups);
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
        {#each groups as group (group.uuid)}
            <table class="mb-4 w-full border-collapse">
                <thead>
                    <tr>
                        <th class="border px-4 py-2 text-left">Name</th>
                        <th class="border px-4 py-2 text-left">Users</th>
                        <th class="border px-4 py-2 text-left">Currency</th>
                        <th class="border px-4 py-2 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="border px-4 py-2">{group.name}</td>
                        <td class="border px-4 py-2">{group.users.join(', ')}</td>
                        <td class="border px-4 py-2">{group.currency}</td>
                        <td class="border px-4 py-2"
                            ><Button
                                variant="destructive"
                                onclick={async () =>
                                    await fetch(`/api/groups/${group.uuid}`, {
                                        method: 'DELETE'
                                    })}><Trash2 /></Button
                            ></td
                        >
                    </tr>
                </tbody>
            </table>
        {/each}
    </div>
</div>
