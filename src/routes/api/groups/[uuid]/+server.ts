import db from '$lib/db';
import { json } from '@sveltejs/kit';

export const DELETE = async ({ params }) => {
    const group = await db.groups.findOne(params.uuid).exec();
    if (group) {
        await group.remove();
    }

    return json({ success: true });
};
