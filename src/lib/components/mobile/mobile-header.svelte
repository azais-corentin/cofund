<script lang="ts">
  import UserProfile from '$lib/components/shared/user-profile.svelte';
  import { ArrowLeft, Menu } from '@lucide/svelte';

  interface Props {
    title?: string;
    showBack?: boolean;
    showMenu?: boolean;
    class?: string;
  }

  let { title = '', showBack = false, showMenu = true, class: className = '' }: Props = $props();

  const goBack = () => {
    window.history.back();
  };
</script>

<header class="sticky top-0 z-10 flex items-center bg-background p-4 border-b {className}">
  {#if showBack}
    <button onclick={goBack} class="size-12 flex items-center justify-center">
      <ArrowLeft class="size-6" />
    </button>
  {:else if showMenu}
    <button class="size-12 flex items-center justify-center">
      <Menu class="size-6" />
    </button>
  {:else}
    <div class="size-12"></div>
  {/if}

  <h2 class="text-lg font-bold flex-1 text-center">
    {title}
  </h2>

  <div class="size-12 flex items-center justify-center">
    <UserProfile />
  </div>
</header>
