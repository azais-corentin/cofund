import { Group } from '$lib/db/schema';
import { jazzSSR } from '$lib/jazzSSR.js';

export const load = async ({ parent, params }) => {
  const { breadcrumbs } = await parent();

  const group = await Group.load(params.id, {
    loadAs: jazzSSR,
    resolve: {
      operations: false,
    },
  });

  return {
    breadcrumbs: [...breadcrumbs, {
      name: group?.name ?? 'Unknown group',
      path: params.id,
    }],
  };
};
