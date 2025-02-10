<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import * as Card from '$lib/components/ui/card';
    import * as Form from '$lib/components/ui/form';
    import { Input } from '$lib/components/ui/input';
    import { Minus, Plus } from 'lucide-svelte';
    import { tick } from 'svelte';
    import { type Infer, type SuperValidated, superForm } from 'sveltekit-superforms';
    import { zodClient } from 'sveltekit-superforms/adapters';

    import { type FormSchema, formSchema } from './schema';

    let { data }: { data: { form: SuperValidated<Infer<FormSchema>> } } = $props();

    const form = superForm(data.form, {
        validators: zodClient(formSchema)
    });

    const { form: formData, enhance } = form;

    // Used to update focus to new input when adding a new user
    let lastUserInput: any = $state(undefined);

    const handleInputKeydown = async (event: KeyboardEvent, i: number) => {
        if (event.ctrlKey && event.key === 'Backspace') {
            $formData.users = $formData.users.filter((_, idx) => idx !== i);
        }
        if (event.ctrlKey && event.key === 'Enter' && i == $formData.users.length - 1) {
            $formData.users = [...$formData.users, ''];
            event.preventDefault();
            await tick();
            lastUserInput?.focus();
        }
    };
</script>

<div class="flex min-h-screen flex-col gap-6 p-6">
    <div id="groups-header" class="flex flex-col gap-6">
        <div class="flew-row flex gap-4">
            <div class="flex flex-1 flex-col">
                <div class="pb-2">
                    <h1 class="text-3xl font-semibold">Create group</h1>
                </div>
                <div>
                    <p class="text-l tracking-tight text-muted-foreground">Create a new group</p>
                </div>
            </div>
        </div>
    </div>
    <div id="groups-content" class="flex-1">
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
                                                class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                                bind:value={$formData.users[i]}
                                                onkeydown={(event) => handleInputKeydown(event, i)}
                                            />
                                            <Button
                                                variant="destructive"
                                                class="px-3"
                                                onclick={() =>
                                                    ($formData.users = $formData.users.filter(
                                                        (_, idx) => idx !== i
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
    </div>
</div>
