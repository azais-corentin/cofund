import { db } from '$lib/db/db.js';

export const load = async ({ params }) => {
    console.time('db');
    const group = await db
        .selectFrom('groups')
        .selectAll()
        .where('uuid', '=', params.uuid)
        .executeTakeFirst();
    console.timeEnd('db');

    return {
        navigationData: [
            {
                title: group?.name, // TODO Replace with actual group name from API/database
                description: 'Group details',
                url: '/groups/' + params.uuid
            }
        ],
        group
    };
};
