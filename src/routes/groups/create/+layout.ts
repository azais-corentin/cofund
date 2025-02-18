export const load = async ({ parent }) => {
    const { navigationData } = await parent();

    return {
        navigationData: [
            ...navigationData,
            {
                title: 'Create',
                description: 'Create a new group',
                url: '/groups/create'
            }
        ]
    };
};
