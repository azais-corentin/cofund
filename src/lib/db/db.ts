import { Kysely, PostgresDialect } from 'kysely';
import type { DB } from './types';
import { Pool } from 'pg';

export const db = new Kysely<DB>({
    dialect: new PostgresDialect({
        pool: new Pool({
            database: 'cofund',
            host: 'localhost',
            user: 'cofund'
        })
    })
});
