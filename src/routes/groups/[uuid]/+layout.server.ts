import { db } from '$lib/db/db.js';
import { error } from '@sveltejs/kit';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const load = async ({ params }) => {
    console.time('db');
    const group = await db
        .selectFrom('groups')
        .selectAll()
        .where('uuid', '=', params.uuid)
        .executeTakeFirst();
    console.timeEnd('db');

    if (!group) {
        return error(420, 'Invalid group uuid');
    }

    return {
        navigationData: [
            {
                title: group?.name, // TODO Replace with actual group name from API/database
                description: `Created ${dayjs().to(group.created_at)}`,
                url: '/groups/' + params.uuid
            }
        ],
        group
    };
};
