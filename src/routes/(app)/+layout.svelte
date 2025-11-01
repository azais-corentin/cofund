<script lang="ts">
  import { dev } from '$app/environment';
  import { PUBLIC_JAZZ_API_KEY, PUBLIC_WS_URL } from '$env/static/public';
  import favicon from '$lib/assets/favicon.svg';
  import DesktopFooter from '$lib/components/desktop/footer.svelte';
  import DesktopHeader from '$lib/components/desktop/header.svelte';
  import MobileHeader from '$lib/components/mobile/header.svelte';
  import AuthWrapper from '$lib/components/shared/auth-wrapper.svelte';
  import { Account } from '$lib/db/schema';
  import Button from '$shadcn/button/button.svelte';
  import 'jazz-tools/inspector/register-custom-element';
  import { JazzSvelteProvider } from 'jazz-tools/svelte';
  import { ModeWatcher } from 'mode-watcher';
  import { pwaAssetsHead } from 'virtual:pwa-assets/head';
  import { pwaInfo } from 'virtual:pwa-info';
  import '../../app.css';

  const webManifest = $derived(pwaInfo ? pwaInfo.webManifest.linkTag : '');

  let { children } = $props();

  let debugLayout = $state(false);

  function toggleDebugLayout() {
    debugLayout = !debugLayout;
  }
</script>

<svelte:head>
  {#if pwaAssetsHead.themeColor}
    <meta name="theme-color" content={pwaAssetsHead.themeColor.content} />
  {/if}
  {#each pwaAssetsHead.links as link}
    <link {...link} />
  {/each}
  {@html webManifest}
  <link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher />

<JazzSvelteProvider
  AccountSchema={Account}
  sync={{ peer: `${PUBLIC_WS_URL}?key=${PUBLIC_JAZZ_API_KEY}` }}
  enableSSR
>
  <div class={debugLayout ? 'debug-layout' : ''}>
    <AuthWrapper>
      <div class="relative flex min-h-svh flex-col bg-background">
        <DesktopHeader class="hidden md:block" />
        <MobileHeader class="block md:hidden" />

        {#if process.env.NODE_ENV !== 'production'}
          <jazz-inspector><!----></jazz-inspector>
        {/if}

        <main class="flex-1 px-6 pt-4 md:pt-0">
          {@render children?.()}
        </main>

        <DesktopFooter class="hidden md:block" />
      </div>
    </AuthWrapper>
  </div>
</JazzSvelteProvider>

<!-- Debug Layout Toggle Button - Only shown in development -->
{#if dev}
  <Button
    variant="outline"
    size="sm"
    onclick={toggleDebugLayout}
    class="fixed bottom-4 left-4 z-50 shadow-lg"
    title="Toggle debug layout mode"
  >
    {debugLayout ? '🔍 Debug ON' : '🔍 Debug OFF'}
  </Button>
{/if}

{#await import('$lib/components/shared/pwa-reload-prompt.svelte') then { default: ReloadPrompt }}
  <ReloadPrompt />
{/await}
