// import db from "$lib/db";
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';

export const load = async () => {
  return {
    form: await superValidate(valibot(formSchema)),
  };
};

export const actions = {
  default: async (event) => {
    const form = await superValidate(event, valibot(formSchema));
    if (!form.valid) {
      return fail(400, {
        form,
      });
    }

    // await db.groups.insert({
    //   ...form.data,
    //   id: crypto.randomUUID(),
    //   users: [],
    //   created_at: new Date().toISOString(),
    //   updated_at: new Date().toISOString(),
    // });

    redirect(302, '/groups');
  },
};
