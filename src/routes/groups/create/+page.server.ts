import { db } from '$lib/db/db';
import { getLogger } from '@logtape/logtape';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';

export const load = async () => {
  return { form: await superValidate(valibot(formSchema)) };
};

const logger = getLogger(['groups', 'create']);

export const actions = {
  default: async (event) => {
    const form = await superValidate(event, valibot(formSchema));
    if (!form.valid) {
      return fail(400, { form });
    }

    const group = await db.insert('groups', {
      name: form.data.name,
      currency: form.data.currency,
      users: form.data.users.map((u) => u.name),
      created_at: new Date(),
    });

    logger.info('Created group {group}', { group });

    redirect(302, `/groups/${group.id}`);
  },
};
