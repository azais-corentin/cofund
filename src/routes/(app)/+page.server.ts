import { redirect } from '@sveltejs/kit';

export const load = () => {
  console.info('Redirecting to /groups');
  redirect(307, '/groups');
};
