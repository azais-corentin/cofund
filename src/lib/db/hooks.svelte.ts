import { onDestroy, onMount } from 'svelte';
import type { Row } from 'tinybase';
import { store } from './db';

/**
 * Custom Svelte hook to reactively get all rows from a table
 */
export function useTable<T = Record<string, any>>(
  tableName: string,
  deserialize?: (id: string, row: Row) => T,
) {
  let results = $state<T[]>([]);
  let error = $state<Error | null>(null);
  let fetching = $state(true);

  onMount(() => {
    // Initial load
    const loadData = () => {
      try {
        const table = store.getTable(tableName);
        const entries = Object.entries(table).map(([id, row]) => {
          if (deserialize) {
            return deserialize(id, row);
          }
          return { id, ...row } as T;
        });
        results = entries;
        error = null;
      } catch (e) {
        error = e as Error;
      } finally {
        fetching = false;
      }
    };

    loadData();

    // Listen for changes
    const listenerId = store.addTableListener(tableName, () => {
      loadData();
    });

    onDestroy(() => {
      store.delListener(listenerId);
    });
  });

  return {
    get results() {
      return results;
    },
    get error() {
      return error;
    },
    get fetching() {
      return fetching;
    },
  };
}

/**
 * Custom Svelte hook to reactively get a single row from a table
 */
export function useRow<T = Record<string, any>>(
  tableName: string,
  rowId: string,
  deserialize?: (id: string, row: Row) => T,
) {
  let result = $state<T | null>(null);
  let error = $state<Error | null>(null);
  let fetching = $state(true);

  onMount(() => {
    // Initial load
    const loadData = () => {
      try {
        const row = store.getRow(tableName, rowId);
        if (row && Object.keys(row).length > 0) {
          if (deserialize) {
            result = deserialize(rowId, row);
          } else {
            result = { id: rowId, ...row } as T;
          }
        } else {
          result = null;
        }
        error = null;
      } catch (e) {
        error = e as Error;
      } finally {
        fetching = false;
      }
    };

    loadData();

    // Listen for changes to this specific row
    const listenerId = store.addRowListener(tableName, rowId, () => {
      loadData();
    });

    onDestroy(() => {
      store.delListener(listenerId);
    });
  });

  return {
    get result() {
      return result;
    },
    get error() {
      return error;
    },
    get fetching() {
      return fetching;
    },
  };
}

/**
 * Custom Svelte hook for WebSocket connection status
 * Monitors the WsSynchronizer connection status
 */
export function useConnectionStatus() {
  let status = $state<'OPEN' | 'CLOSED' | 'CONNECTING'>('CONNECTING');

  onMount(async () => {
    // Dynamically import synchronizer to avoid SSR issues
    const { synchronizer } = await import('./db');

    if (!synchronizer) {
      status = 'CLOSED';
      return;
    }

    // Get initial status
    const wsStatus = synchronizer.getWebSocket().readyState;
    status = wsStatus === WebSocket.OPEN
      ? 'OPEN'
      : wsStatus === WebSocket.CONNECTING
      ? 'CONNECTING'
      : 'CLOSED';

    // Listen for status changes on the WebSocket
    const ws = synchronizer.getWebSocket();

    const handleOpen = () => {
      status = 'OPEN';
    };

    const handleClose = () => {
      status = 'CLOSED';
    };

    const handleError = () => {
      status = 'CLOSED';
    };

    ws.addEventListener('open', handleOpen);
    ws.addEventListener('close', handleClose);
    ws.addEventListener('error', handleError);

    onDestroy(() => {
      ws.removeEventListener('open', handleOpen);
      ws.removeEventListener('close', handleClose);
      ws.removeEventListener('error', handleError);
    });
  });

  return {
    get status() {
      return status;
    },
  };
}
