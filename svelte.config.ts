import adapterExe from '@jesterkit/exe-sveltekit';
import adapterAuto from '@sveltejs/adapter-auto';
import { Config } from '@sveltejs/kit';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config: Config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: process.env.ADAPTER === 'exe'
      ? adapterExe({ binaryName: 'cofund' })
      : adapterAuto(),
    serviceWorker: { register: false },
    alias: {
      '$shadcn': 'src/lib/components/shared/shadcn',
    },
  },
};

export default config;
