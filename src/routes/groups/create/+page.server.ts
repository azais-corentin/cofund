import { getLogger } from '@logtape/logtape';
import { fail } from '@sveltejs/kit';
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

    // Generate a unique ID for the group
    const groupId = crypto.randomUUID();

    logger.info('Validated group creation {groupId}', {
      groupId,
      name: form.data.name,
      currency: form.data.currency,
      users: form
        .data
        .users
        .map((u) => u.name),
    });

    // Return success with the group data - client will handle insertion
    return {
      success: true,
      groupId,
      groupData: {
        name: form.data.name,
        currency: form.data.currency,
        users: form.data.users.map((u) => u.name),
        created_at: Date.now(),
      },
    };
  },
};
