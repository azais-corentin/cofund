import { DATABASE_URL } from '$env/static/private';
import { getLogger } from '@logtape/logtape';
import postgres from 'postgres';
import { createMergeableStore, createRelationships } from 'tinybase';
import {
  createPostgresPersister,
  type PostgresPersister,
} from 'tinybase/persisters/persister-postgres';
import { tablesSchema } from './schema';

const dbLogger = getLogger(['cofund', 'db']);

export const serverStore = createMergeableStore().setTablesSchema(tablesSchema);

export const relationships = createRelationships(serverStore).setRelationshipDefinition(
  'groupOperations',
  'operations',
  'groups',
  'group_id',
);

let persister: PostgresPersister | null = null;

const sql = postgres(DATABASE_URL);

export const createPersisterForPath = async () => {
  return await initializeServerPersister();
};

export const initializeServerPersister = async () => {
  if (persister) {
    dbLogger.info('Reusing PostgreSQL persister for path');
    return persister;
  }

  dbLogger.info('Creating PostgreSQL persister');
  persister = await createPostgresPersister(serverStore, sql, {
    mode: 'tabular',
    tables: {
      load: { groups: 'groups', operations: 'operations' },
      save: { groups: 'groups', operations: 'operations' },
    },
  });

  dbLogger.info('Loading data from PostgreSQL');
  await persister.load();
  dbLogger.info('Starting auto-save for PostgreSQL persister');
  await persister.startAutoSave();

  persister.addStatusListener((persister, status) => {
    dbLogger.info(`PostgreSQL persister status: ${JSON.stringify(status)}`);
  });

  dbLogger.info('PostgreSQL persister is ready');

  return persister;
};

export const getPersister = () => {
  return persister;
};

export const destroyServerPersister = async () => {
  if (persister) {
    await persister.destroy();
    persister = null;
  }
  await sql.end();
};

export const deleteOperation = (operationId: string) => {
  serverStore.delRow('operations', operationId);
};
