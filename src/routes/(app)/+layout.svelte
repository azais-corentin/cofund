<script lang="ts">
  import { dev } from '$app/environment';
  import { PUBLIC_JAZZ_API_KEY, PUBLIC_WS_URL } from '$env/static/public';
  import favicon from '$lib/assets/favicon.svg';
  import AuthWrapper from '$lib/components/auth-wrapper.svelte';
  import Button from '$lib/components/shadcn/button/button.svelte';
  import SiteFooter from '$lib/components/site-footer.svelte';
  import SiteHeader from '$lib/components/site-header.svelte';
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
>
  <div class={debugLayout ? 'debug-layout' : ''}>
    <AuthWrapper>
      <div class="relative flex min-h-svh flex-col bg-background">
        <div class="hidden md:block">
          <SiteHeader />
        </div>

        {#if process.env.NODE_ENV !== 'production'}
          <jazz-inspector><!----></jazz-inspector>
        {/if}

        <main class="flex-1 px-6 pt-4 md:pt-0">
          {@render children?.()}
        </main>

        <div class="hidden md:block">
          <SiteFooter />
        </div>
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

{#await import('$lib/ReloadPrompt.svelte') then { default: ReloadPrompt }}
  <ReloadPrompt />
{/await}
