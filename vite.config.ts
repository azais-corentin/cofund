import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit(),
    SvelteKitPWA({
      srcDir: './src',
      mode: 'development',
      strategies: 'generateSW',
      scope: '/',
      base: '/',
      selfDestroying: false,
      pwaAssets: {
        config: true,
      },
      manifest: {
        short_name: 'cofund',
        name: 'cofund',
        description: 'Manage shared expenses',
        display: 'standalone',
        start_url: '/groups',
        scope: '/',
        theme_color: '#fafafa',
        background_color: '#09090b',
      },
      injectManifest: {
        globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,woff,woff2}'],
      },
      workbox: {
        globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,woff,woff2}'],
      },
      devOptions: {
        enabled: false,
        suppressWarnings: false,
        type: 'module',
        navigateFallback: '/groups',
      },
      kit: {
        includeVersionFile: true,
      },
    }),
  ],
  server: {
    host: true,
  },
  define: {
    BUILD_DATE: JSON.stringify(new Date().toISOString()),
  },
});
