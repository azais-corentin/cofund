<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { Group, Operation } from '$lib/db/schema';
  import { OperationFormSchema } from '$lib/schemas/index';
  import * as Card from '$shadcn/card';
  import * as Form from '$shadcn/form';
  import { Input } from '$shadcn/input';
  import { CoState } from 'jazz-tools/svelte';
  import { watch } from 'runed';
  import { SvelteSet } from 'svelte/reactivity';
  import { defaults, superForm } from 'sveltekit-superforms';
  import { zod4 } from 'sveltekit-superforms/adapters';

  const groupState = new CoState(Group, page.params.id, {
    resolve: {
      operations: true,
    },
  });

  const group = $derived(groupState.current);

  const form = superForm(defaults(zod4(OperationFormSchema)), {
    SPA: true,
    dataType: 'json',
    validators: zod4(OperationFormSchema),
    async onUpdate({ form }) {
      if (!form.valid || !group) {
        console.error(form.errors);
        return;
      }

      const data = form.data;
      const operation = Operation.create({
        created_at: new Date(),
        title: data.title,
        amount: data.amount,
        paid_by: data.paid_by,
        split_type: data.split_type,
        split: data.split,
      });

      console.info('Adding operation:', operation);

      group.operations.$jazz.push(operation);

      await goto(`/groups/${page.params.id}`);
    },
  });

  const { form: formData, enhance } = form;

  let selectedMembers = new SvelteSet<string>();

  watch(() => group?.users, () => {
    if (group?.users) {
      for (const user of group.users) {
        selectedMembers.add(user);
      }
    }
  });

  const toggleMember = (member: string) => {
    if (selectedMembers.has(member)) {
      selectedMembers.delete(member);
    } else {
      selectedMembers.add(member);
    }
  };
</script>

<form method="POST" use:enhance class="flex flex-col gap-6">
  <Card.Root>
    <Card.Header>
      <Card.Title>Expense details</Card.Title>
    </Card.Header>
    <Card.Content class="space-y-4">
      <Form.Field {form} name="title">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Title</Form.Label>
            <Input {...props} bind:value={$formData.title} placeholder="Enter expense title" />
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <Form.Field {form} name="amount">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Amount</Form.Label>
            <div class="relative">
              <Input
                {...props}
                type="number"
                step="0.01"
                bind:value={$formData.amount}
                placeholder="0.00"
                class="pl-8"
              />
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {group?.currency ?? '$'}
              </span>
            </div>
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <Form.Field {form} name="paid_by">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Paid by</Form.Label>
            <select
              {...props}
              bind:value={$formData.paid_by}
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select who paid</option>
              {#if group?.users}
                {#each group.users as user}
                  <option value={user}>{user}</option>
                {/each}
              {/if}
            </select>
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </Card.Content>
  </Card.Root>

  <Card.Root>
    <Card.Header>
      <Card.Title>Split</Card.Title>
      <Card.Description>How should this expense be split?</Card.Description>
    </Card.Header>
    <Card.Content class="space-y-4">
      <div class="grid grid-cols-3 gap-2 rounded-xl bg-muted p-1">
        <button
          type="button"
          onclick={() => $formData.split_type = 'equally'}
          class="px-4 py-2 text-sm font-medium rounded-lg transition-colors {$formData.split_type === 'equally' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}"
        >
          Equally
        </button>
        <button
          type="button"
          onclick={() => $formData.split_type = 'as_parts'}
          class="px-4 py-2 text-sm font-medium rounded-lg transition-colors {$formData.split_type === 'as_parts' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}"
        >
          As Parts
        </button>
        <button
          type="button"
          onclick={() => $formData.split_type = 'by_amount'}
          class="px-4 py-2 text-sm font-medium rounded-lg transition-colors {$formData.split_type === 'by_amount' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}"
        >
          By Amount
        </button>
      </div>

      <div class="space-y-3">
        <p class="text-sm font-medium leading-none">Split between</p>
        <div class="grid grid-cols-2 gap-3">
          {#if group?.users}
            {#each group.users as user}
              {@const initials = user
              .split(' ')
              .map((n: string) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)}
              <button
                type="button"
                onclick={() => toggleMember(user)}
                class="bg-card rounded-lg p-3 flex flex-col items-center justify-center transition-all {selectedMembers.has(user) ? 'ring-2 ring-primary' : 'opacity-50 hover:opacity-75'}"
              >
                <div class="size-12 rounded-full bg-secondary mb-2 flex items-center justify-center text-foreground font-bold text-lg">
                  {initials}
                </div>
                <p class="text-sm font-medium">{user}</p>
              </button>
            {/each}
          {/if}
        </div>
      </div>
    </Card.Content>
  </Card.Root>

  <Form.Button class="w-full">Add Expense</Form.Button>
</form>
