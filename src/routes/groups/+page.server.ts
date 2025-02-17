import db from '$lib/db';

export const load = async () => {
    return {
        groups: await db.selectFrom('groups').selectAll().execute()
    };
};
