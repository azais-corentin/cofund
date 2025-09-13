import { Schema as S } from '@triplit/client';

export const schema = S.Collections({
  groups: {
    schema: S.Schema({
      id: S.Id(),
      name: S.String(),
      currency: S.String(),
      users: S.Set(S.String()),
      created_at: S.Date(),
    }),
    relationships: {
      operations: S.RelationMany('operations', {
        where: [['group_id', '=', '$id']],
      }),
    },
  },
  operations: {
    schema: S.Schema({
      id: S.Id(),
      group_id: S.String(),
      created_at: S.Date(),
      title: S.String(),
      amount: S.Number(),
      paid_by: S.String(),
      split_type: S.String(),
      split: S.Json(), // array of { user: string, value: number }
    }),
  },
});
