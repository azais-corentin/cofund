<script lang="ts">
  let { data } = $props();
</script>

{data.group?.name}

<p>Users:</p>
<ul class="ml-6 list-disc">
  {#each data.group?.users ?? [] as user (user)}
    <li class="mt-2">{user}</li>
  {/each}
</ul>
