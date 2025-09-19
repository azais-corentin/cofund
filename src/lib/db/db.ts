import { browser } from '$app/environment';
import { TriplitClient } from '@triplit/client';
import { schema } from './schema';

export const db = new TriplitClient({
  storage: browser ? 'indexeddb' : 'memory',
  schema,
  serverUrl: 'http://localhost:6543',
  // This is the service token
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ4LXRyaXBsaXQtdG9rZW4tdHlwZSI6InNlY3JldCIsIngtdHJpcGxpdC1wcm9qZWN0LWlkIjoibG9jYWwtcHJvamVjdC1pZCJ9.8Z76XXPc9esdlZb2b7NDC7IVajNXKc4eVcPsO7Ve0ug',
  autoConnect: true,
});

export const Query = db.query;
