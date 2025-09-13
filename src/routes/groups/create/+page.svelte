<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import { Minus, Plus } from '@lucide/svelte';
  import { tick } from 'svelte';
  import { type SuperValidated, superForm } from 'sveltekit-superforms';
  import { valibotClient } from 'sveltekit-superforms/adapters';
  import * as valibot from 'valibot';
  import { formSchema } from './schema';

  import { TriplitClient } from '@triplit/client';
  import { useQuery } from '@triplit/svelte';
  import { db } from '$lib/db/db';
  import { schema } from '$lib/db/schema.js';

  let {
    data,
  }: {
    data: { form: SuperValidated<valibot.InferOutput<typeof formSchema>> };
  } = $props();

  const client = new TriplitClient({ schema, autoConnect: false });
  const groups = useQuery(db, client.query('groups'));

  const form = superForm(data.form, {
    validators: valibotClient(formSchema),
  });

  const { form: formData, enhance } = form;

  // Used to update focus to new input when adding a new user
  let lastUserInput: HTMLInputElement | undefined = $state(undefined);

  const handleInputKeydown = async (event: KeyboardEvent, i: number) => {
    if (event.ctrlKey && event.key === 'Backspace') {
      $formData.users = $formData.users.filter((_, idx) => idx !== i);
    }
    if (
      event.ctrlKey &&
      event.key === 'Enter' &&
      i == $formData.users.length - 1
    ) {
      $formData.users = [...$formData.users, ''];
      event.preventDefault();
      await tick();
      lastUserInput?.focus();
    }
  };
</script>

<form method="POST" use:enhance class="flex flex-col gap-6">
  <Card.Root>
    <Card.Header>
      <Card.Title>Group information</Card.Title>
    </Card.Header>
    <Card.Content>
      <Form.Field {form} name="name">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Name</Form.Label>
            <Input {...props} bind:value={$formData.name} />
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field {form} name="currency">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Currency symbol</Form.Label>
            <Input
              {...props}
              bind:value={$formData.currency}
              placeholder="$, €, £, ..."
            />
            <Form.Description>We'll use it to display amounts</Form.Description>
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </Card.Content>
  </Card.Root>
  <Card.Root>
    <Card.Header>
      <Card.Title>Users</Card.Title>
      <Card.Description>Enter the name of each participants</Card.Description>
    </Card.Header>
    <Card.Content>
      <Form.Field {form} name="users">
        {#each $formData.users, i}
          <Form.ElementField {form} name="users[{i}]">
            <Form.Control>
              {#snippet children({ props })}
                <div class="flex items-center gap-4">
                  <input
                    {...props}
                    placeholder="User name"
                    bind:this={lastUserInput}
                    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    bind:value={$formData.users[i]}
                    onkeydown={(event) => handleInputKeydown(event, i)}
                  />
                  <Button
                    variant="destructive"
                    class="px-3"
                    onclick={() =>
                      ($formData.users = $formData.users.filter(
                        (_, idx) => idx !== i,
                      ))}
                  >
                    <Minus />
                  </Button>
                </div>
              {/snippet}
            </Form.Control>
            <Form.FieldErrors />
          </Form.ElementField>
        {/each}
        <Form.Description>Press Ctrl+Enter to add more users</Form.Description>
        <Form.FieldErrors />
      </Form.Field>
      <Button onclick={() => ($formData.users = [...$formData.users, ''])}>
        <Plus />
        Add user
      </Button>
    </Card.Content>
  </Card.Root>
  <Form.Button><Plus class="mr-2" /> Create group</Form.Button>
</form>
