import db from '$lib/db';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { v4 as uuidv4 } from 'uuid';

import { formSchema } from './schema';

export const load = async () => {
    return {
        form: await superValidate(zod(formSchema))
    };
};

export const actions = {
    default: async (event) => {
        const form = await superValidate(event, zod(formSchema));
        if (!form.valid) {
            return fail(400, {
                form
            });
        }

        await db.groups.insert({
            ...form.data,
            id: uuidv4(),
            users: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        });

        redirect(302, '/groups');
    }
};
