import { browser } from '$app/environment';
import { onMount } from 'svelte';
import { getSynchronizer } from './db';

let connection = $state<{ status: 'CLOSED' | 'CONNECTING' | 'CONNECTED' }>({
  status: 'CONNECTING',
});

export const useConnection = () => {
  onMount(async () => {
    if (!browser) {
      return;
    }

    console.info('Waiting for synchronizer to initialize...');
    const sync = await getSynchronizer();
    console.info('Synchronizer initialized');

    if (!sync) {
      connection.status = 'CLOSED';
      throw new Error('Failed to initialize synchronizer');
    }

    const ws = sync.getWebSocket();

    // Set initial status
    console.info('WebSocket initial readyState:', ws.readyState);
    connection.status = ws.readyState === WebSocket.OPEN
      ? 'CONNECTED'
      : ws.readyState === WebSocket.CONNECTING
      ? 'CONNECTING'
      : 'CLOSED';

    // Listen for status changes
    ws.addEventListener('open', () => {
      connection.status = 'CONNECTED';
    });

    ws.addEventListener('close', () => {
      connection.status = 'CLOSED';
    });

    ws.addEventListener('error', () => {
      connection.status = 'CLOSED';
    });
  });

  return { connection };
};
