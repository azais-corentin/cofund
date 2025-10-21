import { browser } from '$app/environment';
import { PUBLIC_WS_URL } from '$env/static/public';
import { createMergeableStore, createRelationships } from 'tinybase';
import {
  createIndexedDbPersister,
  type IndexedDbPersister,
} from 'tinybase/persisters/persister-indexed-db';
import {
  createWsSynchronizer,
  type WsSynchronizer,
} from 'tinybase/synchronizers/synchronizer-ws-client';
import { tablesSchema } from './schema';

// Create the mergeable store (required for WsSynchronizer)
export const store = createMergeableStore().setTablesSchema(tablesSchema);

// Create relationships
export const relationships = createRelationships(store).setRelationshipDefinition(
  'groupOperations',
  'operations',
  'groups',
  'group_id',
);

// Initialize persister for IndexedDB storage
let persister: IndexedDbPersister | null = null;
let synchronizer: Promise<WsSynchronizer<WebSocket>> | null = null;

if (browser) {
  console.info('Creating IndexedDB persister');
  persister = createIndexedDbPersister(store, 'cofund-db');

  console.info('Loading data from IndexedDB');
  await persister.load();
  console.info('Starting auto-save for IndexedDB persister');
  await persister.startAutoSave();

  console.info('IndexedDB persister is ready');

  // Set up WebSocket synchronization
  try {
    console.info(`Connecting to WebSocket server at ${PUBLIC_WS_URL}`);
    const ws = new WebSocket(PUBLIC_WS_URL);
    console.info('Setting up and starting WebSocket synchronizer');
    synchronizer = createWsSynchronizer(store, ws).then(sync => sync.startSync());
  } catch (error) {
    console.error('Failed to connect to WebSocket server:', error);
    throw new Error('Failed to initialize synchronizer');
  }
  console.info('WebSocket synchronizer is ready');
} else {
  persister = null;
  synchronizer = null;
}

export const getPersister = () => {
  return persister;
};

export const getSynchronizer = () => {
  return synchronizer;
};

export const deleteOperation = (operationId: string) => {
  store.delRow('operations', operationId);
};
