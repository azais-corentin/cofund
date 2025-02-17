import { Kysely, PostgresDialect } from 'kysely';
import type { KyselifyDatabase } from 'kysely-supabase';
import { Pool } from 'pg';

import type { DB as SupabaseDatabase } from './types';

export type Database = KyselifyDatabase<SupabaseDatabase>;

export const db = new Kysely<SupabaseDatabase>({
    dialect: new PostgresDialect({
        pool: new Pool({
            connectionString: process.env.DATABASE_URL
        })
    })
});
