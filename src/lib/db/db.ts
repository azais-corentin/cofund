import { browser } from '$app/environment';
import { createMergeableStore, createRelationships } from 'tinybase';
import { createIndexedDbPersister } from 'tinybase/persisters/persister-indexed-db';
import { createWsSynchronizer } from 'tinybase/synchronizers/synchronizer-ws-client';

// Create the mergeable store (required for WsSynchronizer)
export const store = createMergeableStore();

// Create relationships
export const relationships = createRelationships(store);

// Define relationships between tables
relationships.setRelationshipDefinition('groupOperations', 'operations', 'groups', 'group_id');

// Initialize persister for IndexedDB storage
let persister: ReturnType<typeof createIndexedDbPersister> | null = null;

export const synchronizer = (async () => {
  if (!browser) {
    return null;
  }

  const wsUrl = import.meta.env.PUBLIC_WS_URL || 'ws://localhost:8043';

  console.info('Setting up IndexedDB persister');
  persister = createIndexedDbPersister(store, 'cofund-db');

  console.info('Loading data from IndexedDB');
  await persister.load();
  console.info('Starting auto-save for IndexedDB persister');
  await persister.startAutoSave();

  persister.addStatusListener((persister, status) => {
    console.log(`persister status changed to ${status}`);
  });

  // Set up WebSocket synchronization
  try {
    console.info(`Connecting to WebSocket server at ${wsUrl}`);
    const ws = new WebSocket(wsUrl);
    console.info('Setting up WebSocket synchronizer');
    const synchronizer = await createWsSynchronizer(store, ws);
    console.info('Starting WebSocket synchronizer');
    await synchronizer.startSync();
    return synchronizer;
  } catch (error) {
    console.error('Failed to connect to WebSocket server:', error);
    return null;
  }
})();

export { persister };
