import { co, z } from 'jazz-tools';

export const Operation = co.map({
  created_at: z.date(),
  title: z.string(),
  amount: z.number(),
  paid_by: z.array(z.string()),
  split_type: z.enum(['equally', 'as_parts', 'by_amount']),
  split: z.string(),
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

export const Account = co
  .account({
    root: co.map({
      groups: ListOfGroups,
    }),
    profile: co.profile({
      name: z.string(),
    }),
  })
  .withMigration((account) => {
    if (!account.$jazz.has('root')) {
      account.$jazz.set('root', {
        groups: [],
      });
    }
  });
