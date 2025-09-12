export const load = async () => {
  //   const groups = await db.groups.find().exec();
  return {
    groups: [
      {
        uuid: 'group-1',
        name: 'Group 1',
        users: ['User 1', 'User 2'],
        currency: 'USD',
        created_at: new Date(),
      },
    ],
  };
};
