import { sql } from 'kysely';

import { db } from './db';

let query = db.schema
    .createTable('groups')
    .addColumn('uuid', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('created_at', 'timestamp', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('currency', 'varchar', (col) => col.notNull())
    .addColumn('name', 'varchar', (col) => col.notNull())
    .addColumn('users', sql`varchar[]`, (col) => col.notNull())
    .compile();

console.log(query.sql);
