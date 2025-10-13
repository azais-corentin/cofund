import adapter from '@jesterkit/exe-sveltekit';
import type { Config } from '@sveltejs/kit';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config: Config = {
  preprocess: vitePreprocess(),
  kit: { adapter: adapter({ binaryName: 'cofund' }), serviceWorker: { register: false } },
};

export default config;
