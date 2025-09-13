import 'vite-plugin-pwa/info';
import 'vite-plugin-pwa/pwa-assets';
import 'vite-plugin-pwa/svelte';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      userid: string;
      buildDate: string;
      periodicUpdates: boolean;
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
