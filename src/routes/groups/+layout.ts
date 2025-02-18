export const load = async ({ parent }) => {
    return {
        navigationData: [
            {
                title: 'Groups',
                description: 'Manage your shared group expenses',
                url: '/groups'
            }
        ]
    };
};
