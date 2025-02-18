<script lang="ts">
    import { page } from '$app/state';
    import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
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

<div class="flex min-h-screen flex-col gap-6">
    <div id="groups-header" class="flex flex-col gap-6">
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
                {#each groups as group (group.uuid)}
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
                {/each}
            </tbody>
        </table>
    </div>
</div>
