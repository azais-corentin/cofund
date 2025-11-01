<script lang="ts">
  import { Toaster } from '$shadcn/sonner/index.js';
  import { toast } from 'svelte-sonner';
  import { useRegisterSW } from 'virtual:pwa-register/svelte';

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
      console.log('Service worker registration error', error);
    },
  });

  const handleUpdate = () => {
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
      toastId = toast.info('Ready to work offline', {
        duration: 5000,
        onDismiss: handleClose,
      });
    } else if ($needRefresh) {
      toastId = toast.info('New version available', {
        description: 'Click to update the app',
        duration: Infinity,
        onDismiss: handleClose,
        action: {
          label: 'Update',
          onClick: handleUpdate,
        },
      });
    }
  });
</script>

<Toaster position="bottom-right" closeButton richColors />

<div class="hidden">
  {buildDate}
</div>
