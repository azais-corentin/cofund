<script lang="ts">
  import {
    ArrowLeft,
    Car,
    Check,
    Clock,
    Hotel,
    Plus,
    Split,
    Utensils,
    Waves,
  } from '@lucide/svelte';
  import { getContext } from 'svelte';

  const groupQuery: any = getContext('groupQuery');
  const group = $derived(groupQuery?.result);

  // const totalSpent = $derived(operations.reduce((sum, op) => sum + op.amount, 0));
  const totalSpent = 0;

  // const groupedOperations = $derived.by(() => {
  //   const grouped = new Map<string, Operation[]>();
  //   const sorted = [...operations].sort((a, b) => b.created_at - a.created_at);

  //   for (const op of sorted) {
  //     const dateKey = dayjs(op.created_at).format('YYYY-MM-DD');
  //     if (!grouped.has(dateKey)) {
  //       grouped.set(dateKey, []);
  //     }
  //     grouped.get(dateKey)!.push(op);
  //   }

  //   return Array.from(grouped.entries());
  // });

  // const currentMonth = $derived(
  //   operations.length > 0
  //     ? dayjs(operations[0].created_at).format('MMMM YYYY')
  //     : dayjs().format('MMMM YYYY'),
  // );
  const currentMonth = 'October 2025';

  function getCategoryIcon(title: string) {
    const lower = title.toLowerCase();
    if (
      lower.includes('dinner') || lower.includes('lunch') || lower.includes('restaurant')
      || lower.includes('food')
    ) {
      return Utensils;
    }
    if (lower.includes('taxi') || lower.includes('car') || lower.includes('uber')) {
      return Car;
    }
    if (lower.includes('hotel') || lower.includes('accommodation')) {
      return Hotel;
    }
    if (lower.includes('snorkel') || lower.includes('diving') || lower.includes('swim')) {
      return Waves;
    }
    return Utensils;
  }

  function getStatusIcon(splitType: string) {
    if (splitType === 'paid') return Check;
    if (splitType === 'pending') return Clock;
    return Split;
  }

  function getStatusClass(splitType: string) {
    if (splitType === 'paid') return 'bg-[oklch(0.646_0.222_41.116)] text-white';
    if (splitType === 'pending') return 'bg-orange-400 text-white';
    return 'bg-blue-400 text-white';
  }

  function formatCurrency(amount: number, currencySymbol: string = '$') {
    return `${currencySymbol}${amount.toFixed(2)}`;
  }

  function getUserInitials(name: string) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  function getAvatarColor(name: string) {
    const colors = ['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-green-500',
      'bg-yellow-500', 'bg-red-500'];
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  }
</script>

<div class="relative flex min-h-screen w-full flex-col">
  <div class="sticky top-0 z-10 flex items-center bg-background p-4 pb-2 justify-between border-b">
    <a href="/groups" class="flex size-12 shrink-0 items-center justify-center">
      <ArrowLeft class="size-6" />
    </a>
    <h2 class="text-lg font-bold flex-1 text-center">
      {group?.name ?? 'Loading...'}
    </h2>
    <div class="size-12 shrink-0"></div>
  </div>

  <div class="p-4">
    <div class="flex flex-col items-stretch justify-start rounded-xl shadow-lg bg-card p-6">
      <p class="text-muted-foreground text-base font-medium">
        Total Money Spent
      </p>
      <p class="text-foreground text-4xl font-bold mt-1">
        {formatCurrency(totalSpent, group?.currency ?? 'USD')}
      </p>
    </div>
  </div>

  <div class="sticky top-[76px] z-10 bg-background py-2 px-4">
    <h3 class="text-xl font-bold">
      {currentMonth}
    </h3>
  </div>

  <div class="flex flex-col gap-6 px-4 pb-24">
    <!-- {#if operationsQuery.fetching}
      <p class="text-muted-foreground text-center py-8">Loading expenses...</p>
    {:else if operations.length === 0}
      <p class="text-muted-foreground text-center py-8">No expenses yet. Add your first expense!</p>
    {:else}
      {#each groupedOperations as [dateKey, ops] (dateKey)}
        <div class="flex flex-col gap-3">
          <h4 class="text-muted-foreground text-sm font-semibold uppercase tracking-wide">
            {dayjs(dateKey).format('MMM DD, YYYY')}
          </h4>
          <div class="flex flex-col gap-4">
            {#each ops as operation (operation.id)}
              {@const IconComponent = getCategoryIcon(operation.title)}
              {@const StatusIcon = getStatusIcon(operation.split_type)}
              {@const splitData = JSON.parse(operation.split)}
              {@const participants = Array.isArray(splitData) ? splitData : [operation.paid_by]}
              <SwipeableExpense
                onDelete={() => deleteOperation(operation.id)}
                onEdit={() => goto(`/groups/${group?.id}/edit/${operation.id}`)}
              >
                {#snippet children()}
                  <div class="flex items-center gap-4 bg-card p-4 rounded-lg shadow-md">
                    <div class="text-white flex items-center justify-center rounded-lg bg-primary shrink-0 size-12">
                      <IconComponent class="size-6" />
                    </div>
                    <div class="flex flex-col justify-center flex-grow">
                      <p class="text-foreground text-base font-medium line-clamp-1">
                        {operation.title}
                      </p>
                      <div class="flex items-center gap-2 mt-1">
                        <p class="text-muted-foreground text-sm">
                          Paid by: {operation.paid_by}
                        </p>
                        <div class="flex items-center">
                          {#each participants.slice(0, 3) as participant, idx (participant + idx)}
                            <div
                              class="size-6 rounded-full border-2 border-card flex items-center justify-center text-[10px] font-semibold text-white {getAvatarColor(participant)}"
                              class:-ml-2={idx > 0}
                              title={participant}
                            >
                              {getUserInitials(participant)}
                            </div>
                          {/each}
                        </div>
                      </div>
                    </div>
                    <div class="shrink-0 flex flex-col items-end">
                      <p class="text-foreground text-base font-semibold">
                        {formatCurrency(operation.amount, group?.currency ?? 'USD')}
                      </p>
                      <div class="rounded-full size-5 flex items-center justify-center mt-1 {getStatusClass(operation.split_type)}">
                        <StatusIcon class="size-3" />
                      </div>
                    </div>
                  </div>
                {/snippet}
              </SwipeableExpense>
            {/each}
          </div>
        </div>
      {/each}
    {/if} -->
  </div>

  <button
    onclick={() => window.location.href = `/groups/${group?.id}/new`}
    class="fixed bottom-6 right-6 flex h-16 w-16 items-center justify-center rounded-full bg-[oklch(0.646_0.222_41.116)] text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
  >
    <Plus class="size-8" />
  </button>
</div>
