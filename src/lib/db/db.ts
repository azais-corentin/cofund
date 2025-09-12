import { addRxPlugin, createRxDatabase, toTypedRxJsonSchema } from 'rxdb/plugins/core';
import type { ExtractDocumentTypeFromTypedRxJsonSchema, RxJsonSchema } from 'rxdb/plugins/core';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { replicateCouchDB } from 'rxdb/plugins/replication-couchdb';
import { getRxStorageLocalstorage } from 'rxdb/plugins/storage-localstorage';
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';

addRxPlugin(RxDBDevModePlugin);

export const db = await createRxDatabase({
    name: 'mydatabase',
    storage: wrappedValidateAjvStorage({
        storage: getRxStorageLocalstorage()
    })
});

const groupSchemaLiteral = {
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: {
            type: 'string',
            maxLength: 36
        },
        created_at: {
            type: 'string',
            format: 'date-time'
        },
        updated_at: {
            type: 'string',
            format: 'date-time'
        },
        name: {
            type: 'string',
            maxLength: 100
        },
        currency: {
            type: 'string',
            maxLength: 3
        },
        users: {
            type: 'array',
            items: {
                type: 'string',
                maxLength: 100
            }
        }
    },
    required: ['id', 'created_at', 'updated_at', 'name', 'currency']
} as const;

await db.addCollections({ groups: { schema: groupSchemaLiteral } });

type GroupsSchemaTyped = ReturnType<typeof toTypedRxJsonSchema<typeof groupSchemaLiteral>>;
export type GroupsDocType = ExtractDocumentTypeFromTypedRxJsonSchema<GroupsSchemaTyped>;
export const groupsSchema: RxJsonSchema<GroupsDocType> = groupSchemaLiteral;
