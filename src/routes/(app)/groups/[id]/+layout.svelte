<script lang="ts">
  let { children } = $props();

  // TODO Fetch group name from PouchDB

  // $effect(() => {
  //   setBreadcrumb({ name: groupName ?? '?', path: `/groups/${page.params.id}` });
  // });
</script>

{@render children()}
