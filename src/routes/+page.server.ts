import { getLogger } from '@logtape/logtape';
import { redirect } from '@sveltejs/kit';

const logger = getLogger();

export const load = () => {
  logger.info('Redirecting to /groups');
  redirect(307, '/groups');
};
