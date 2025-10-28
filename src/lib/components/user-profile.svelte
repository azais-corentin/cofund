<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import { Account } from '$lib/db/schema';
  import { LogOut, Settings, User } from '@lucide/svelte';
  import { AccountCoState } from 'jazz-tools/svelte';

  const me = new AccountCoState(Account, {
    resolve: { profile: true },
  });

  const profile = $derived(me.current?.profile);
  const userName = $derived(profile?.name ?? 'User');
  const userAvatar = $derived(profile?.avatar);

  function handleLogOut() {
    me.logOut();
  }
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <Button variant="ghost" size="icon" {...props}>
        {#if userAvatar}
          <img src={userAvatar} alt={userName} class="h-8 w-8 rounded-full" />
        {:else}
          <User class="h-5 w-5" />
        {/if}
      </Button>
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content align="end">
    <DropdownMenu.Label>{userName}</DropdownMenu.Label>
    <DropdownMenu.Separator />
    <DropdownMenu.Item>
      <a href="/profile" class="flex items-center w-full">
        <Settings class="mr-2 h-4 w-4" />
        Profile Settings
      </a>
    </DropdownMenu.Item>
    <DropdownMenu.Item onclick={handleLogOut}>
      <LogOut class="mr-2 h-4 w-4" />
      Log Out
    </DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
