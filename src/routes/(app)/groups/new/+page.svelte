<script lang="ts">
  import { goto } from '$app/navigation';
  import { Badge } from '$lib/components/ui/badge';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import { Account, Group } from '$lib/db/schema';
  import { Minus, Plus } from '@lucide/svelte';
  import { AccountCoState } from 'jazz-tools/svelte';
  import { tick } from 'svelte';
  import { defaults, superForm } from 'sveltekit-superforms';
  import { typebox } from 'sveltekit-superforms/adapters';
  import { formSchema } from './schema';

  const me = new AccountCoState(Account, {
    resolve: { root: { groups: true }, profile: true },
  });

  const form = superForm(defaults(typebox(formSchema)), {
    SPA: true,
    validators: typebox(formSchema),
    onUpdate({ form }) {
      if (!form.valid || !me.current) {
        return;
      }

      const group = Group.create({
        operations: [],
        ...form.data,
        users: form.data.users.map(u => u.name),
        created_at: new Date(),
      });

      console.log('Creating group', group);

      me.current.root.groups.$jazz.push(group);

      console.log('Navigating to group page', group.$jazz.id);

      goto(`/groups/${group.$jazz.id}`);
    },
  });

  const { form: formData, enhance } = form;

  // Used to update focus to new input when adding a new user
  let userInputs: (HTMLElement | null)[] = $state([null]);
  let globalIndex = 1;

  const addNewUser = async (index?: number) => {
    const newIndex = (index ?? $formData.users.length - 1) + 1;

    $formData.users = $formData.users.toSpliced(newIndex, 0, { uuid: globalIndex++, name: '' });
    userInputs.splice(newIndex, 0, null);
    await tick();
    console.log('Focusing new user input');
    userInputs[newIndex]?.focus();
  };

  const removeUser = async (index: number) => {
    if ($formData.users.length <= 1) {
      return;
    }

    $formData.users = $formData.users.toSpliced(index, 1);
    userInputs.splice(index, 1);
    await tick();
    if (index > 0) {
      userInputs[index - 1]?.focus();
    } else {
      userInputs[0]?.focus();
    }
  };

  const handleInputKeydown = async (event: KeyboardEvent, i: number) => {
    if (!event.ctrlKey) {
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      addNewUser(i);
    } else if (event.key === 'Backspace') {
      event.preventDefault();
      removeUser(i);
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
            <Input {...props} bind:value={$formData.currency} placeholder="$, €, £, ..." />
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
        {#each $formData.users as user, i (user.uuid)}
          <Form.Field {form} name="users[{i}].name" class="mb-4">
            <Form.Control>
              {#snippet children({ props })}
                <div class="flex items-center gap-4">
                  <Input
                    {...props}
                    placeholder="User name"
                    bind:ref={userInputs[i]}
                    bind:value={$formData.users[i].name}
                    onkeydown={(event) => handleInputKeydown(event, i)}
                  />
                  <Button
                    aria-label="Remove user"
                    variant="destructive"
                    class="px-3"
                    onclick={() => ($formData.users = $formData.users.filter((_, idx) =>
                      idx !== i
                    ))}
                  >
                    <Minus />
                  </Button>
                </div>
              {/snippet}
            </Form.Control>
            <Form.FieldErrors />
          </Form.Field>
        {/each}
        <Form.Description>
          Press
          <Badge variant="outline" class="h-5 px-1.5 font-mono">Ctrl + Enter</Badge> to add more
          users or <Badge variant="outline" class="h-5 px-1.5 font-mono">Ctrl + Backspace</Badge>
          to remove the current user
        </Form.Description>
        <Form.FieldErrors />
      </Form.Field>
      <Button onclick={async () => await addNewUser()}>
        <Plus />
        Add user
      </Button>
    </Card.Content>
  </Card.Root>
  <Form.Button><Plus class="mr-2" /> Create group</Form.Button>
</form>
