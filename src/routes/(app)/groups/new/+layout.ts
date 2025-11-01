export const load = async ({ parent }) => {
  const { breadcrumbs } = await parent();

  return {
    breadcrumbs: [...breadcrumbs, {
      name: 'New group',
      path: 'new',
    }],
  };
};
