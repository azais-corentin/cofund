// import db from "$lib/db";
import { error } from '@sveltejs/kit';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const load = async ({ params }) => {
  //   const group = await db.groups.findOne(params.uuid).exec();

  const group = {
    uuid: 'group-1',
    name: 'Group 1',
    users: ['User 1', 'User 2'],
    currency: 'USD',
    created_at: new Date(),
  };

  if (!group) {
    return error(420, 'Invalid group uuid');
  }

  const groupJSON = group;

  return {
    navigationData: [
      {
        title: groupJSON?.name, // TODO Replace with actual group name from API/database
        description: `Created ${dayjs().to(groupJSON.created_at)}`,
        url: '/groups/' + params.uuid,
      },
    ],
    group: groupJSON,
  };
};
