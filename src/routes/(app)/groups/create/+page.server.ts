import { getLogger } from '@logtape/logtape';
import { type Actions, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { typebox } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';

export const load = async () => {
  return { form: await superValidate(typebox(formSchema)) };
};

const logger = getLogger(['groups', 'create']);

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, typebox(formSchema));
    if (!form.valid) {
      return fail(400, { form });
    }

    const groupId = crypto.randomUUID();

    logger.info('Validated group creation {groupId}', {
      groupId,
      name: form.data.name,
      currency: form.data.currency,
      users: form.data.users.map((u) => u.name),
    });

    return {
      success: true,
      groupId,
      groupData: {
        name: form.data.name,
        currency: form.data.currency ?? '€',
        users: form.data.users.map((u) => u.name),
        created_at: new Date().toISOString(),
      },
    };
  },
};
