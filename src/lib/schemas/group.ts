import { z } from 'zod';
import { ShortText } from './common.js';

export const GroupSchema = z.object({
  id: z.uuid(),
  created_at: z.iso.datetime(),
  name: ShortText,
  currency: z.string().min(1).max(255).default('€'),
  users: z.array(ShortText).min(1),
});

export type Group = z.infer<typeof GroupSchema>;

export const GroupFormSchema = GroupSchema
  .omit({
    id: true,
    created_at: true,
    users: true,
  })
  .extend({
    users: z
      .array(z.object({
        index: z.number(),
        name: ShortText,
      }))
      .min(1)
      .max(255),
  });

export type GroupForm = z.infer<typeof GroupFormSchema>;
