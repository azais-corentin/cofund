import { browser } from '$app/environment';
import { HttpClient, TriplitClient } from '@triplit/client';

import { PUBLIC_TRIPLIT_SERVER_URL, PUBLIC_TRIPLIT_SERVICE_TOKEN } from '$env/static/public';
import { schema } from './schema';

const sharedConfiguration = {
  schema,
  serverUrl: PUBLIC_TRIPLIT_SERVER_URL,
  token: PUBLIC_TRIPLIT_SERVICE_TOKEN,
};

export const db = browser
  ? new TriplitClient({
      ...sharedConfiguration,
      storage: 'indexeddb',
      autoConnect: true,
    })
  : new HttpClient(sharedConfiguration);

export const Query = db.query;
