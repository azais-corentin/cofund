<script lang="ts">
  import { useRegisterSW } from 'virtual:pwa-register/svelte';
  import { toast } from 'svelte-sonner';
  import { Toaster } from '$lib/components/shadcn/sonner/index.js';

  // replaced dynamically
  const buildDate = BUILD_DATE;

  let toastId = $state<string | number | undefined>(undefined);

  const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      if (r) {
        setInterval(async () => {
          if (r.installing || !navigator) return;

          if ('connection' in navigator && !navigator.onLine) return;

          const resp = await fetch(swUrl, {
            cache: 'no-store',
            headers: { cache: 'no-store', 'cache-control': 'no-cache' },
          });

          if (resp?.status === 200) await r.update();
        }, 20000 /* 20s for testing purposes */);
      }
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  const handleReload = () => {
    if (toastId) toast.dismiss(toastId);
    updateServiceWorker(true);
  };

  const handleClose = () => {
    if (toastId) toast.dismiss(toastId);
    offlineReady.set(false);
    needRefresh.set(false);
  };

  $effect(() => {
    if ($offlineReady) {
      toastId = toast('App ready to work offline', {
        duration: Infinity,
        action: {
          label: 'Close',
          onClick: handleClose,
        },
      });
    } else if ($needRefresh) {
      toastId = toast('New content available', {
        description: 'Click reload to update the app.',
        duration: Infinity,
        action: {
          label: 'Reload',
          onClick: handleReload,
        },
        cancel: {
          label: 'Close',
          onClick: handleClose,
        },
      });
    }
  });
</script>

<Toaster position="bottom-right" />

<div class="hidden">
  {buildDate}
</div>
