import {
    REALTIME_LISTEN_TYPES,
    REALTIME_POSTGRES_CHANGES_LISTEN_EVENT
} from '@supabase/supabase-js';

import { supabase } from './supabaseClient';

export const observeLive = <T>(
    table: string,
    output: T[],
    compareId: (newValue: T, oldValue: T) => boolean
) => {
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
                old: T;
                new: T;
                errors: never;
            }) => {
                console.log('Change received: ');
                console.log(payload);

                switch (payload.eventType) {
                    case 'INSERT':
                        output.push(payload.new);
                        break;
                    case 'UPDATE': {
                        const index = output.findIndex((row) => compareId(row, payload.old));
                        if (index > -1) {
                            output[index] = payload.new;
                        } else {
                            console.error('Supabase local db out of date: missing row');
                        }
                        console.log(output);
                        break;
                    }
                    case 'DELETE': {
                        const index = output.findIndex((row) => compareId(row, payload.old));
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
