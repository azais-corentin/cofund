import { browser } from '$app/environment';
import { createMergeableStore, createRelationships } from 'tinybase';
import { createIndexedDbPersister } from 'tinybase/persisters/persister-indexed-db';
import { createWsSynchronizer } from 'tinybase/synchronizers/synchronizer-ws-client';
import type { WsSynchronizer } from 'tinybase/synchronizers/synchronizer-ws-client';

// Create the mergeable store (required for WsSynchronizer)
export const store = createMergeableStore();

// Create relationships
export const relationships = createRelationships(store);

// Define relationships between tables
relationships.setRelationshipDefinition('groupOperations', 'operations', 'groups', 'group_id');

// Initialize persister for IndexedDB storage
let persister: ReturnType<typeof createIndexedDbPersister> | null = null;
let synchronizer: WsSynchronizer<WebSocket> | null = null;

if (browser) {
  // Get WebSocket URL from environment or use default
  const wsUrl = import.meta.env.PUBLIC_WS_URL || 'ws://localhost:8043';

  // Set up local persistence first
  persister = createIndexedDbPersister(store, 'cofund-db');

  // Load local data first, then set up sync
  void persister.load().then(async () => {
    void persister?.startAutoSave();

    // Set up WebSocket synchronization
    try {
      const ws = new WebSocket(wsUrl);
      synchronizer = await createWsSynchronizer(store, ws);
      await synchronizer.startSync();
    } catch (error) {
      console.error('Failed to connect to WebSocket server:', error);
    }
  });
}

export { persister, synchronizer };
