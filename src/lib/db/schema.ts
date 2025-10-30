import { ShortText } from '$lib/schemas/common';
import { co, Group as JazzGroup } from 'jazz-tools';
import { z } from 'zod';

export const Operation = co.map({
  created_at: z.date(),
  title: z.string(),
  amount: z.number(),
  paid_by: ShortText,
  split_type: z.enum(['equally', 'as_parts', 'by_amount']),
  split: z.record(ShortText, z.number()),
});
export type Operation = co.loaded<typeof Operation>;

export const Group = co.map({
  name: z.string(),
  currency: z.string(),
  users: z.array(z.string()),
  created_at: z.date(),
  operations: co.list(Operation),
});
export type Group = co.loaded<typeof Group>;

export const ListOfGroups = co.list(Group);
export type ListOfGroups = co.loaded<typeof ListOfGroups>;

export const Root = co.map({
  groups: ListOfGroups,
});

export const Profile = co.profile({
  name: z.string(),
  avatar: z.optional(z.string()),
  bio: z.optional(z.string()),
});

export const Account = co
  .account({
    root: Root,
    profile: Profile,
  })
  .withMigration((account, creationProps?: { name: string }) => {
    if (!account.$jazz.has('root')) {
      console.info('Initializing root for account migration');
      account.$jazz.set('root', {
        groups: [],
      });
    }

    if (!account.$jazz.has('profile')) {
      console.info('Initializing profile for account migration');

      const profileGroup = JazzGroup.create();
      profileGroup.makePublic();

      account.$jazz.set(
        'profile',
        Profile.create({
          name: creationProps?.name ?? 'New User',
        }),
      );

      account.$jazz.set('profile', {
        name: creationProps?.name ?? 'New User',
      });
    }
  });
