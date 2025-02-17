import db from '$lib/db';
import { json } from '@sveltejs/kit';

export const DELETE = async ({ params }) => {
    db.deleteFrom('groups').where('uuid', '=', params.uuid).executeTakeFirst();

    return json({ success: true });
};
