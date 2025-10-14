import { onDestroy, onMount } from 'svelte';
import type { Row } from 'tinybase';
import { store, synchronizer } from './db';

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

export let connectionStatus = $state<{ state: 'CLOSED' | 'CONNECTING' | 'CONNECTED' }>({
  state: 'CONNECTING',
});

(async () => {
  const sync = await synchronizer;

  if (!sync) {
    connectionStatus.state = 'CLOSED';
    return;
  }

  sync.addStatusListener((persister, status) => {
    console.log(`sync status changed to ${status}`);
  });

  const ws = sync.getWebSocket();

  // Set initial status
  connectionStatus.state = ws.readyState === WebSocket.OPEN
    ? 'CONNECTED'
    : ws.readyState === WebSocket.CONNECTING
    ? 'CONNECTING'
    : 'CLOSED';

  // Listen for status changes
  ws.addEventListener('open', () => {
    connectionStatus.state = 'CONNECTED';
  });

  ws.addEventListener('close', () => {
    connectionStatus.state = 'CLOSED';
  });

  ws.addEventListener('error', () => {
    connectionStatus.state = 'CLOSED';
  });
})();
