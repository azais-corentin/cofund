<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import { Account } from '$lib/db/schema';
  import { ArrowLeft, Check, Save, User } from '@lucide/svelte';
  import { AccountCoState } from 'jazz-tools/svelte';
  import { toast, Toaster } from 'svelte-sonner';
  import { defaults, superForm } from 'sveltekit-superforms';
  import { typebox } from 'sveltekit-superforms/adapters';
  import { formSchema } from './schema';

  const me = new AccountCoState(Account, {
    resolve: { profile: true },
  });

  const profile = $derived(me.current?.profile);

  const form = superForm(defaults(typebox(formSchema)), {
    SPA: true,
    resetForm: false,
    validators: typebox(formSchema),
    async onUpdate({ form }) {
      await me.current?.$jazz.ensureLoaded({ resolve: { profile: true } });
      if (!form.valid || !me.current?.profile) {
        return;
      }

      me.current.profile.$jazz.set('name', form.data.name);
      if (form.data.bio) {
        me.current.profile.$jazz.set('bio', form.data.bio);
      } else {
        me.current.profile.$jazz.set('bio', undefined);
      }

      console.info('Showing sonner...');
      toast.success('Changes have been saved', {});
    },
  });

  const { form: formData, enhance } = form;

  $effect(() => {
    if (profile) {
      $formData.name = profile.name || '';
      $formData.bio = profile.bio ?? '';
    }
  });
</script>

<Toaster position="top-right" closeButton />

<div class="mx-auto max-w-2xl">
  <div class="mb-6">
    <Button variant="ghost" href="/groups">
      <ArrowLeft class="mr-2 h-4 w-4" />
      Back to Groups
    </Button>
  </div>

  <form method="POST" use:enhance class="space-y-6">
    <Card.Root>
      <Card.Header>
        <Card.Title>Profile Settings</Card.Title>
        <Card.Description>Update your personal information</Card.Description>
      </Card.Header>
      <Card.Content class="space-y-6">
        <div class="flex justify-center">
          <div class="relative">
            <div class="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
              {#if profile?.avatar}
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  class="h-24 w-24 rounded-full object-cover"
                />
              {:else}
                <User class="h-12 w-12 text-muted-foreground" />
              {/if}
            </div>
          </div>
        </div>

        <Form.Field {form} name="name">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Display Name</Form.Label>
              <Input {...props} bind:value={$formData.name} placeholder="Your name" />
              <Form.Description>
                This is how other users will see you in groups
              </Form.Description>
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="bio">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Bio</Form.Label>
              <Input {...props} bind:value={$formData.bio} placeholder="Tell us about yourself" />
              <Form.Description>A short description about you (optional)</Form.Description>
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
      </Card.Content>
      <Card.Footer>
        <Form.Button class="w-full">
          <Save class="mr-2 h-4 w-4" />
          Save Changes
        </Form.Button>
      </Card.Footer>
    </Card.Root>

    <Card.Root>
      <Card.Header>
        <Card.Title>Authentication</Card.Title>
        <Card.Description>Manage your passkey authentication</Card.Description>
      </Card.Header>
      <Card.Content>
        <div class="flex items-center justify-between rounded-lg border p-4">
          <div class="space-y-0.5">
            <div class="text-sm font-medium">Passkey Authentication</div>
            <div class="text-sm text-muted-foreground">
              Your account is secured with a passkey
            </div>
          </div>
          <div class="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <Check class="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </Card.Content>
    </Card.Root>
  </form>
</div>
