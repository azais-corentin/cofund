import db from '$lib/db';
import { error } from '@sveltejs/kit';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const load = async ({ params }) => {
    console.time('db');
    const group = await db.groups.findOne(params.uuid).exec();
    console.timeEnd('db');

    if (!group) {
        return error(420, 'Invalid group uuid');
    }

    const groupJSON = group.toJSON();

    return {
        navigationData: [
            {
                title: groupJSON?.name, // TODO Replace with actual group name from API/database
                description: `Created ${dayjs().to(groupJSON.created_at)}`,
                url: '/groups/' + params.uuid
            }
        ],
        group: groupJSON
    };
};
