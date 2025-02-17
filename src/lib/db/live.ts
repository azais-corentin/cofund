// Initialize the JS client
import { type Groups } from '$lib/db/types.js';
import {
    REALTIME_LISTEN_TYPES,
    REALTIME_POSTGRES_CHANGES_LISTEN_EVENT
} from '@supabase/supabase-js';
import { type Selectable } from 'kysely';

import { supabase } from './supabaseClient';

type Group = Selectable<Groups>;

export const observeLive = <T>(table: string, output: Group[]) => {
    supabase
        .channel(table)
        .on(
            REALTIME_LISTEN_TYPES.POSTGRES_CHANGES,
            {
                event: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.ALL,
                schema: 'public',
                table
            },
            async (payload: {
                schema: string;
                table: string;
                commit_timestamp: string;
                eventType: string;
                old: Group;
                new: Group;
                errors: any;
            }) => {
                console.log('Change received: ');
                console.log(payload);

                switch (payload.eventType) {
                    case 'INSERT':
                        output.push(payload.new);
                        break;
                    case 'UPDATE': {
                        const index = output.findIndex((row) => row.uuid == payload.old.uuid);
                        if (index > -1) {
                            output[index] = payload.new;
                        } else {
                            console.error('Supabase local db out of date: missing row');
                        }
                        console.log(output);
                        break;
                    }
                    case 'DELETE': {
                        const index = output.findIndex((row) => row.uuid == payload.old.uuid);
                        if (index > -1) {
                            output.splice(index, 1);
                        }
                        break;
                    }
                    default:
                        console.log('Unknown eventType in payload');
                        break;
                }
            }
        )
        .subscribe(() => {
            console.log('Subscribed to changes');
        });
};
