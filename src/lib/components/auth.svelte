<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Key, LoaderCircle } from '@lucide/svelte';
  import { usePasskeyAuth } from 'jazz-tools/svelte';

  const auth = usePasskeyAuth({ appName: 'Cofund' });

  let username = $state('');
  let error = $state<string | undefined>();
  let isSignUpMode = $state(true);
  let isLoading = $state(false);

  async function handleSignUp(e: Event) {
    e.preventDefault();

    if (!username.trim()) {
      error = 'Name is required';
      return;
    }

    error = undefined;
    isLoading = true;
    try {
      await auth.current.signUp(username);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('cancelled') || err.message.includes('abort')) {
          error = 'Passkey creation was cancelled. Please try again.';
        } else if (err.message.includes('NotSupported')) {
          error = 'Passkeys are not supported on this device or browser.';
        } else {
          error = err.message;
        }
      } else {
        error = 'Sign up failed. Please try again.';
      }
    } finally {
      isLoading = false;
    }
  }

  async function handleLogIn(e: Event) {
    e.preventDefault();
    error = undefined;
    isLoading = true;

    try {
      await auth.current.logIn();
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('cancelled') || err.message.includes('abort')) {
          error = 'Passkey authentication was cancelled. Please try again.';
        } else if (err.message.includes('NotSupported')) {
          error = 'Passkeys are not supported on this device or browser.';
        } else if (err.message.includes('NotAllowed')) {
          error = 'Passkey authentication was not allowed. Please try again.';
        } else {
          error = err.message;
        }
      } else {
        error = 'Log in failed. Please try again.';
      }
    } finally {
      isLoading = false;
    }
  }

  function toggleMode() {
    isSignUpMode = !isSignUpMode;
    error = undefined;
    username = '';
  }
</script>

<div class="flex min-h-screen items-center justify-center p-4">
  <Card.Root class="mx-auto w-full max-w-md">
    <Card.Header>
      <Card.Title class="text-2xl">{isSignUpMode ? 'Create Account' : 'Welcome Back'}</Card.Title>
      <Card.Description>
        {
          isSignUpMode
          ? "Create a new account using your device's passkey"
          : "Log in with your device's passkey"
        }
      </Card.Description>
    </Card.Header>
    <Card.Content>
      {#if isSignUpMode}
        <form onsubmit={handleSignUp} class="space-y-4">
          <div class="space-y-2">
            <Label for="username">Your Name</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your name"
              bind:value={username}
              disabled={isLoading}
              required
            />
          </div>

          {#if error}
            <p class="text-sm text-destructive">{error}</p>
          {/if}

          <Button type="submit" class="w-full" disabled={isLoading}>
            {#if isLoading}
              <LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            {:else}
              <Key class="mr-2 h-4 w-4" />
              Create Account with Passkey
            {/if}
          </Button>
        </form>
      {:else}
        <form onsubmit={handleLogIn} class="space-y-4">
          {#if error}
            <p class="text-sm text-destructive">{error}</p>
          {/if}

          <Button type="submit" class="w-full" disabled={isLoading}>
            {#if isLoading}
              <LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
              Authenticating...
            {:else}
              <Key class="mr-2 h-4 w-4" />
              Log In with Passkey
            {/if}
          </Button>
        </form>
      {/if}

      <div class="mt-4 text-center">
        <Button variant="link" onclick={toggleMode} class="text-sm" disabled={isLoading}>
          {
            isSignUpMode
            ? 'Already have an account? Log in'
            : 'Need an account? Sign up'
          }
        </Button>
      </div>

      <p class="mt-4 text-center text-xs text-muted-foreground">
        Passkeys are stored securely on your device and never leave it.
      </p>
    </Card.Content>
  </Card.Root>
</div>
