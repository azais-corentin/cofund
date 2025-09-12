<script lang="ts">
    let { data } = $props();
</script>

{data.group?.name}

<p>Users:</p>
<ul class="list-disc ml-6">
    {#each data.group?.users ?? [] as user (user)}
        <li class="mt-2">{user}</li>
    {/each}
</ul>
