export const load = async ({ parent, data }) => {
  const { navigationData } = await parent();

  return {
    ...data,
    navigationData: [...navigationData, ...data.navigationData],
  };
};
