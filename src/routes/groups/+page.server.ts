import db from '$lib/db';

export const load = async () => {
    const groups = await db.groups.find().exec();
    return {
        groups: groups.map((g: any) => g.toJSON())
    };
};
