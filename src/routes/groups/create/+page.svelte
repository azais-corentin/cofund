<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import { Input } from '$lib/components/ui/input';
    import { Moon, Plus, Search, Sun } from 'lucide-svelte';
    import { toggleMode } from 'mode-watcher';

    import CreateGroupForm from './create-group-form.svelte';

    let { data } = $props();
</script>

<div class="flex min-h-screen flex-col gap-6 p-6">
    <div id="groups-header" class="flex flex-col gap-6">
        <div class="flew-row flex gap-4">
            <div class="flex flex-1 flex-col">
                <div class="pb-2">
                    <h1 class="text-3xl font-semibold">Create group</h1>
                </div>
                <div>
                    <p class="text-l tracking-tight text-muted-foreground">Create a new group</p>
                </div>
            </div>
        </div>
    </div>
    <div id="groups-content" class="flex-1">
        <CreateGroupForm {data} />

        <ul>
            {#each data.groups as group}
                <li>{group.uuid}: {group.name}</li>
            {/each}
        </ul>
    </div>
</div>
