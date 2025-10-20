<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import {
    Building2,
    Car,
    Coffee,
    Film,
    Menu,
    Pizza,
    Plane,
    Plus,
    Search,
    Users,
  } from '@lucide/svelte';
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';

  import { useTable } from '$lib/db/hooks.svelte';
  import { deserializeGroup, type Group } from '$lib/db/schema';

  dayjs.extend(relativeTime);

  const groups = useTable<Group>('groups', deserializeGroup);

  // Icon mapping for different group types (based on name patterns)
  const getGroupIconComponent = (name: string) => {
    const lowerName = name.toLowerCase();
    if (
      lowerName.includes('trip') || lowerName.includes('travel') || lowerName.includes('paris')
    ) return Plane;
    if (
      lowerName.includes('apartment') || lowerName.includes('rent') || lowerName.includes('house')
    ) return Building2;
    if (
      lowerName.includes('car') || lowerName.includes('drive') || lowerName.includes('getaway')
    ) return Car;
    if (
      lowerName.includes('pizza') || lowerName.includes('food') || lowerName.includes('dinner')
    ) return Pizza;
    if (lowerName.includes('coffee')) return Coffee;
    if (lowerName.includes('movie') || lowerName.includes('cinema')) return Film;
    return Users;
  };

  // Mock balance calculation - in a real app, this would calculate from operations
  const getBalance = (
    groupId: string,
  ): { amount: number; status: 'owe' | 'owed' | 'settled' } => {
    // This is temporary mock data - replace with actual balance calculation
    const mockBalances: Record<string, { amount: number; status: 'owe' | 'owed' | 'settled' }> =
      {};
    return mockBalances[groupId] || { amount: 0, status: 'settled' };
  };

  const formatBalance = (
    balance: { amount: number; status: 'owe' | 'owed' | 'settled' },
  ): { text: string; class: string } => {
    if (balance.status === 'settled') {
      return { text: 'Settled', class: 'text-muted-foreground' };
    }
    if (balance.status === 'owe') {
      return { text: `You owe $${Math.abs(balance.amount)}`, class: 'text-red-500' };
    }
    return { text: `You are owed $${balance.amount}`, class: 'text-green-500' };
  };
</script>

<!-- Mobile-first header -->
<div class="flex items-center justify-between pb-2 -mx-6 px-6 md:mx-0 md:px-0">
  <button class="flex size-12 shrink-0 items-center justify-center text-foreground md:hidden">
    <Menu class="size-6" />
  </button>
  <h2 class="text-lg font-bold leading-tight tracking-tight flex-1 text-center md:text-left md:text-2xl">
    Groups
  </h2>
  <div class="flex w-12 items-center justify-end md:hidden">
    <Button variant="ghost" size="icon" class="size-12">
      <Search class="size-5" />
    </Button>
  </div>
</div>

<!-- Desktop search (hidden on mobile) -->
<div class="hidden md:flex flex-row gap-4 mt-4 mb-6">
  <div class="relative flex-1">
    <Search class="absolute top-[50%] left-2 h-4 w-4 translate-y-[-50%] text-muted-foreground" />
    <Input placeholder="Filter groups" class="pl-8" />
  </div>
</div>

<div class="h-5"></div>

<!-- Groups list -->
<div class="flex flex-col gap-4 -mx-6 px-4 md:mx-0 md:px-0">
  {#if groups.fetching}
    <p class="text-center text-muted-foreground py-8">Loading...</p>
  {:else if groups.error}
    <p class="text-center text-destructive py-8">Error: {groups.error.message}</p>
  {:else if groups.results && groups.results.length > 0}
    {#each groups.results as group (group.id)}
      {@const balance = getBalance(group.id)}
      {@const balanceFormat = formatBalance(balance)}
      {@const IconComponent = getGroupIconComponent(group.name)}
      <a href="/groups/{group.id}" class="block">
        <div class="flex items-center gap-4 bg-card p-4 rounded-xl justify-between hover:bg-accent transition-colors">
          <div class="flex items-center gap-4 flex-1 min-w-0">
            <div class="flex items-center justify-center rounded-lg bg-secondary shrink-0 size-12">
              <IconComponent class="size-6 text-foreground" />
            </div>
            <div class="flex flex-col justify-center min-w-0 flex-1">
              <p class="text-base font-medium leading-normal truncate">{group.name}</p>
              <p class="text-sm font-normal leading-normal text-muted-foreground truncate">
                {group.users.length} member{group.users.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div class="shrink-0">
            <p class="text-base font-medium leading-normal {balanceFormat.class}">
              {balanceFormat.text}
            </p>
          </div>
        </div>
      </a>
    {/each}
  {:else}
    <div class="text-center py-12">
      <p class="text-muted-foreground mb-4">No groups yet</p>
      <p class="text-sm text-muted-foreground">Create your first group to start sharing expenses</p>
    </div>
  {/if}
</div>

<!-- Spacer for floating button -->
<div class="h-24"></div>

<!-- Floating action button -->
<div class="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-background to-transparent pt-10 pb-5 px-5 flex justify-end pointer-events-none md:hidden">
  <a href="/groups/create" class="pointer-events-auto">
    <Button
      size="lg"
      class="h-14 px-5 gap-4 pl-4 pr-6 shadow-lg bg-[oklch(0.646_0.222_41.116)] hover:bg-[oklch(0.646_0.222_41.116)]/90 text-white"
    >
      <Plus class="size-6" />
      <span class="truncate">Create New Group</span>
    </Button>
  </a>
</div>

<!-- Desktop "Create Group" button -->
<div class="hidden md:flex justify-start mt-6">
  <a href="/groups/create">
    <Button size="lg" class="gap-2">
      <Plus class="size-5" />
      <span>Create New Group</span>
    </Button>
  </a>
</div>
