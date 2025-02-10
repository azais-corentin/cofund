import db from '$lib/db';

export const load = async () => {
    return {
        groups: await db.selectFrom('groups').selectAll().execute()
    };
};

export const actions = {
    default: async ({ request }) => {
        const data = await request.formData();

        const name = data.get('name')?.toString() ?? '';

        if (name.length > 0) {
            await db.insertInto('groups').values({ name }).execute();
        }
    }
};
