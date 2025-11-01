import adapter from '@sveltejs/adapter-cloudflare';
import type { Config } from '@sveltejs/kit';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config: Config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    serviceWorker: { register: false },
    alias: {
      '$shadcn': 'src/lib/components/shared/shadcn',
    },
  },
};

export default config;
