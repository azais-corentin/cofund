export const load = async ({ parent, params, data }) => {
    const { navigationData } = await parent();

    return {
        ...data,
        navigationData: [...navigationData, ...data.navigationData]
    };
};
