import { getLogger } from '@logtape/logtape';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { typebox } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';

export const load = async () => {
  return { form: await superValidate(typebox(formSchema)) };
};

const logger = getLogger(['groups', 'expenses', 'create']);

export const actions = {
  default: async (event) => {
    const form = await superValidate(event, typebox(formSchema));
    if (!form.valid) {
      return fail(400, { form });
    }

    const operationId = crypto.randomUUID();

    logger.info('Validated expense creation {operationId}', {
      operationId,
      groupId: event.params.id,
      title: form.data.title,
      amount: form.data.amount,
      paid_by: form.data.paid_by,
      split_type: form.data.split_type,
    });

    return {
      success: true,
      operationId,
      operationData: {
        group_id: event.params.id,
        title: form.data.title,
        amount: form.data.amount,
        paid_by: form.data.paid_by,
        date: form.data.date,
        split_type: form.data.split_type,
        split: form.data.split,
        created_at: Date.now(),
      },
    };
  },
};
